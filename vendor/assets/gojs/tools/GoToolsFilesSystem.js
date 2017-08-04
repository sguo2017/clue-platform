/*
* Copyright (C) 1998-2017 by Northwoods Software Corporation
* All Rights Reserved.
*
* GoTools Filesystem Class
* Handles GoTools-specific saving / loading model data events
* Attached to a specific instance of GoTools (via constructor); can be assigned to GoTools.goToolsFilesystem
* Currently only supports saving / loading from localstorage 
*/

/*
* GoTools Filesystem Constructor
* @param {GoTools} goTools A reference to a valid instance of GoTools
* @param {Object} state A JSON object with string ids for UI objects (windows, listboxes, HTML elements)
*   {
*       openWindowId: {String} the id of the HTML window to open a file
*       removeWindowId: {String} the id of the HTML window to remove files
*       currentFileId: {String} the id of the HTML element containing the name of the currently open file
*       filesToOpenListId: {String} the id of the HTML listbox in the openWindow
*       filesToRemoveListId: {String} the id of the HTML listbox of the removeWindow
*   }
*/
function GoToolsFilesSystem(goTools, state) {
    this._goTools = goTools;
    this._UNSAVED_FILENAME = "(Unsaved File)";
    this._DEFAULT_MODELDATA = {
        "units": "centimeters",
        "unitsAbbreviation": "cm",
        "gridSize": 10,
        "wallWidth": 5,
        "preferences": {
            showWallGuidelines: true,
            showWallLengths: true,
            showWallAngles: true,
            showOnlySmallWallAngles: true,
            showGrid: true,
            gridSnap: true
        }
    };
    this._state = state;
}

// Get the GoTools associated with this GoTools Filesystem
Object.defineProperty(GoToolsFilesSystem.prototype, "goTools", {
    get: function () { return this._goTools; }
});

// Get constant name for an unsaved GoTools 
Object.defineProperty(GoToolsFilesSystem.prototype, "UNSAVED_FILENAME", {
    get: function () { return this._UNSAVED_FILENAME; }
});

// Get constant default model data (default GoTools model data for a new GoTools)
Object.defineProperty(GoToolsFilesSystem.prototype, "DEFAULT_MODELDATA", {
    get: function () { return this._DEFAULT_MODELDATA; }
});

// Get state information about this app's UI
Object.defineProperty(GoToolsFilesSystem.prototype, "state", {
    get: function () { return this._state; }
});

/*
* Helper functions
* Check Local Storage, Update File List, Open Element
*/

// Ensure local storage works in browser (not supported by MS IE/Edge)
function checkLocalStorage() {
    try {
        window.localStorage.setItem('item', 'item');
        window.localStorage.removeItem('item');
        return true;
    } catch (e) {
        return false;
    }
}

// Update listbox of files in window (for loading / removing files)
function updateFileList(id) {
    // displays cached floor plan files in the listboxes
    var listbox = document.getElementById(id);
    // remove any old listing of files
    var last;
    while (last = listbox.lastChild) listbox.removeChild(last);
    // now add all saved files to the listbox
    for (key in window.localStorage) {
        var storedFile = window.localStorage.getItem(key);
        if (!storedFile) continue;
        var option = document.createElement("option");
        option.value = key;
        option.text = key;
        listbox.add(option, null)
    }
}

// Open a specifed window element -- used for Remove / Open file windows
function openWindow(id, listid) {
    var panel = document.getElementById(id);
    if (panel.style.visibility === "hidden") {
        updateFileList(listid);
        panel.style.visibility = "visible";
    }
}

/*
* Instance methods
* New GoTools, Save GoTools, Save GoTools As, Load GoTools, Remove GoTools
* Show Open Window, Show Remove Window
* Set Current File Name, Get Current File Name
*/

// Create new goTools (Ctrl + D or File -> New)
GoToolsFilesSystem.prototype.newGoTools = function() {
    var goTools = this.goTools;
    // checks to see if all changes have been saved
    if (goTools.isModified) {
        var save = confirm("Would you like to save changes to " + this.getCurrentFileName() + "?");
        if (save) {
            this.saveGoTools();
        }
    }
    this.setCurrentFileName(this.UNSAVED_FILENAME);
    // loads an empty diagram
    var model = new go.GraphLinksModel;
    // initialize all modelData
    model.modelData = this.DEFAULT_MODELDATA;
    goTools.model = model;
    goTools.undoManager.isEnabled = true;
    goTools.isModified = false;
    if (goTools.goToolsUI) goTools.goToolsUI.updateUI();
}

// Save current floor plan to local storage (Ctrl + S or File -> Save)
GoToolsFilesSystem.prototype.saveGoTools = function () {
    if (checkLocalStorage()) {
        var saveName = this.getCurrentFileName();
        if (saveName === this.UNSAVED_FILENAME) {
            this.saveGoToolsAs();
        } else {
            window.localStorage.setItem(saveName, this.goTools.model.toJson());
            this.goTools.isModified = false;
        }
    }
}

// Save floor plan to local storage with a new name (File -> Save As)
GoToolsFilesSystem.prototype.saveGoToolsAs = function () {
    if (checkLocalStorage()) {
        var saveName = prompt("Save file as...", this.getCurrentFileName());
        // if saveName is already in list of files, ask if overwrite is ok
        if (saveName && saveName !== this.UNSAVED_FILENAME) {
            var override = true;
            if (window.localStorage.getItem(saveName) !== null) {
                override = confirm("Do you want to overwrite " + saveName + "?");
            }
            if (override) {
                this.setCurrentFileName(saveName);
                window.localStorage.setItem(saveName, this.goTools.model.toJson());
                this.goTools.isModified = false;
            }
        }
    }
}

// Load goTools model data in "Open" window (Ctrl + O or File -> Open)
GoToolsFilesSystem.prototype.loadGoTools = function () {
    var goTools = this.goTools;
    var listbox = document.getElementById(this.state.filesToOpenListId);
    var fileName = undefined; // get selected filename
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        var savedFile = window.localStorage.getItem(fileName);
        this.loadGoToolsFromModel(savedFile);
        goTools.isModified = false;
        this.setCurrentFileName(fileName);
    }
    if (goTools.goToolsUI) goTools.goToolsUI.closeElement(this.state.openWindowId);
}

GoToolsFilesSystem.prototype.loadGoToolsFromModel = function (str) {
    var goTools = this.goTools;
    goTools.layout = go.GraphObject.make(go.Layout);
    goTools.model = go.Model.fromJson(str);
    goTools.skipsUndoManager = true;
    goTools.startTransaction("generate walls");
    goTools.nodes.each(function (node) {
        if (node.category === "WallGroup") goTools.updateWall(node);
    });
    if (goTools.goToolsUI) goTools.goToolsUI.updateUI();

    goTools.commitTransaction("generate walls");
    goTools.undoManager.isEnabled = true;

}

// Delete selected goTools from local storage
GoToolsFilesSystem.prototype.removeGoTools = function () {
    var goTools = this.goTools;
    var listbox = document.getElementById(this.state.filesToRemoveListId);
    var fileName = undefined; // get selected filename
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        // removes file from local storage
        window.localStorage.removeItem(fileName);
    }
    if (goTools.goToolsUI) goTools.goToolsUI.closeElement(this.state.removeWindowId);
}

// Check to see if all changes have been saved -> show the "Open" window
GoToolsFilesSystem.prototype.showOpenWindow = function () {
    if (checkLocalStorage()) {
        if (this.goTools.isModified) {
            var save = confirm("Would you like to save changes to " + this.getCurrentFileName() + "?");
            if (save) {
                this.saveGoTools();
            }
        }
        openWindow(this.state.openWindowId, this.state.filesToOpenListId);
    }
}

// Show the Remove File window
GoToolsFilesSystem.prototype.showRemoveWindow = function () {
    if (checkLocalStorage()) {
        openWindow(this.state.removeWindowId, this.state.filesToRemoveListId);
    }
}

// Add * to current file element if diagram has been modified
GoToolsFilesSystem.prototype.setCurrentFileName= function(name) {
    var currentFile = document.getElementById(this.state.currentFileId);
    if (this.goTools.isModified) name += "*";
    currentFile.textContent = name;
}

// Get current file name from the current file element
GoToolsFilesSystem.prototype.getCurrentFileName = function() {
    var currentFile = document.getElementById(this.state.currentFileId);
    var name = currentFile.textContent;
    if (name[name.length - 1] === "*") return name.substr(0, name.length - 1);
    return name;
}