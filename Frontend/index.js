let Selected_Item = 0;

const Backend_URL = '';

const Versions_Registry_URL = 'https://raw.githubusercontent.com/AlixANNERAUD/Xila/master/Code/lib/Xila/versions_registry.xrf';

class Software {

    constructor() {
        this.Name = '';
    }
}

let Softwares = [];

var Versions_Registry = [];

function Refresh_Version_Registry() {

    fetch(Versions_Registry_URL)
        .then(Response => {
            if (Response.status == 200) {
                return Response.json();
            }
        })
        .then(JSON_Data => {
            Versions_Registry = JSON_Data['Versions_Registry'];
            Display_Versions();
            Display_Default_Software();

        })
        .catch(error => console.error(error)); 
}

async function Upload_Software(Index, Request_ID) {
    let Form = document.getElementById('Upload_Form');
    let Data = new FormData(Form);

    let Request = new XMLHttpRequest();
    Request.open('POST', '/upload');
    Request.send(Data);
}

function Add_Software() {
    Softwares.push(new Software());
    Display_Additional_Softwares();
}

function Delete_Software() {
    if (Softwares.length > Selected_Item) {
        Softwares.splice(Selected_Item, 1);
    }
    Display_Additional_Softwares();
}

function Set_Active(Index) {
    Selected_Item = Index;
    Display_Additional_Softwares();
}

function Display_Versions() {
    let Versions = document.getElementById('Xila_Versions');
    Versions.innerHTML = '';
    for (var i = 0; i < Versions_Registry.length; i++) {
        let Version = document.createElement('option');
        if (i == 0) {
            Version.selected = true;
        }
        Version.setAttribute('value', i);
        Version.innerHTML = Versions_Registry[i].Version;
        Versions.appendChild(Version);
    }
}

function Display_Additional_Softwares() {

    if (Selected_Item > 0) {
        while (Selected_Item >= Softwares.length) {
            Selected_Item = Selected_Item - 1;
        }
    }
    var List = document.getElementById('Additional_Software_List');
    List.innerHTML = '';
    for (var i = 0; i < Softwares.length; i++) {
        let Item = document.createElement('li');
        if (i == Selected_Item) {
            Item.classList = 'list-group-item active';
        }
        else {
            Item.classList = 'list-group-item';
        }
        Item.setAttribute('onclick', 'Set_Active(' + i + ')');
        if (Softwares[i].Name != '') {
            Item.innerHTML = Softwares[i].Name + '';
        }
        let File_Division = document.createElement('div');
        File_Division.classList = 'mb-3';

        let File_Input = document.createElement('input')
        File_Input.type = 'file';
        File_Input.classList = 'form-control';
        File_Input.id = 'File_Input_' + i;

        File_Division.appendChild(File_Input);

        Item.appendChild(File_Input);

        List.appendChild(Item);
    }
}

function Display_Default_Software() {

    var Division = document.getElementById('Default_Software_Switches_Division');
    Division.innerHTML = '';

    var Selected_Version = document.getElementById('Xila_Versions').value;
    
    document.getElementById('Switch_Select_All_Software').checked = true;
    
    for (var i = 0; i < Versions_Registry[Selected_Version].Softwares.length; i++) {
        Inner_Division = document.createElement('div');
        Inner_Division.classList = 'form-check form-switch';

        let Input = document.createElement('input');
        Input.type = 'checkbox';
        Input.classList = 'form-check-input';
        Input.name = 'Default_Software_Switch';
        Input.id = 'Default_Software_Switch_' + i;
        Input.checked = true;
        Input.disabled = true;

        let Label = document.createElement('label');
        Label.classList = 'form-check-label'
        Label.setAttribute('for', 'Default_Software_Switch_' + i);
        Label.innerHTML = Versions_Registry[Selected_Version].Softwares[i];

        Inner_Division.appendChild(Input);
        Inner_Division.appendChild(Label);

        Division.appendChild(Inner_Division);
    }
}

function Start_Request() {

    let XHR = new XMLHttpRequest();
    XHR.open("POST", Backend_URL, true);
    let Included_Default_Softwares = [];
    Switches = document.getElementsByName('Default_Software_Switch');
    for (var i = 0, n = Switches.length; i < n; i++) {
        if (Switches[i].checked) {
            Included_Default_Softwares.push(Default_Software[i]);
        }
    }
    let Compilation_Request = {
        'Xila_Version': document.getElementById('Xila_Versions').value,
        'Included_Default_Software': Included_Default_Softwares,
        'Additional_Software': Softwares.length
    };
    let Compilation_Request_Raw = JSON.stringify(Compilation_Request);
    let Compilation_Request_Reply = "";
    fetch("", {
        credentials: "same-origin",
        mode: "same-origin",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: Compilation_Request_Raw
    }).then(resp => {
        if (resp.status === 200) {
            return resp.json();
        }
        else {
            return Promise.reject("server")
        }
    })
        .then(dataJson => {
            Compilation_Request_Reply = JSON.parse(dataJson)
        })
        .catch(error => {
            if (error === "server") {
                return
            }
            console.log(error)
        })

    return Compilation_Request_Reply.Request_ID;
}

function Toggle_All_Software_Switches(Source) {
    Switches = document.getElementsByName('Default_Software_Switch');
    for (var i = 0, n = Switches.length; i < n; i++) {
        Switches[i].checked = Source.checked;
        Switches[i].disabled = Source.checked;
    }
}

function Reset() {
    document.getElementById('Xila_Versions').selected = 0;
    document.getElementById('Switch_Select_All_Software').checked = true;
    Toggle_All_Software_Switches(document.getElementById('Switch_Select_All_Software'))
    Softwares = [];
    Display_Additional_Softwares();
}

function Compile() {

    // Clear output
    Output_Division = document.getElementById('Output');
    Output_Division.innerHTML = '';


    Print_Line('Step 1 : Request a compilation to the server ...');

    let Request_ID = 0; //Start_Request();

    if (Request_ID === undefined) {

        return;
    }
    else {
        Print_Line('> Request accepted !');
        Print_Line('> Request ID : ' + Request_ID);
    }

    Print_Line('Step 2 : Waiting for queue to be empty ...');



    Print_Line('Step 3 : Upload additional software ...');
    for (let i = 0; i < Softwares.length; i++) {
        Print_Line('> Software ' + (i + 1) + '/' + Softwares.length + ': Upload ...');
    }

    Print_Line('Step 4 : Start compilation process ....');


}

function Print(Output_Text) {
    Output_Division = document.getElementById('Output');
    Output_Division.innerHTML += Output_Text;
}

function Print_Line(Output_Text) {
    Output_Division = document.getElementById('Output');
    Output_Division.innerHTML += Output_Text;
    Output_Division.appendChild(document.createElement('br'));
}

function Cancel() {

}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
        Refresh_Version_Registry();
        //Display_Additional_Softwares();
    }
});