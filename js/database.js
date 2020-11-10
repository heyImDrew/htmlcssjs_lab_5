var db = openDatabase("db", "0.1", "db", 200000);
if (!db) {
  alert("Error opening DB!");
}
db.transaction((tx) => {
  tx.executeSql("CREATE TABLE IF NOT EXISTS 'clients' (id REAL UNIQUE, name TEXT, phone TEXT)", [])
  },
  err => console.error("Can't create table", err),
  tx => console.log("Table created")
);
fill_select();

function buttonShow() {
  if (document.getElementById('bshow').innerText == "Show") {
    document.getElementById('bshow').innerText = "Hide";
    db.transaction(function(tx) {
      tx.executeSql("SELECT * FROM 'clients' ORDER BY ID", [], function(tx, result) {
        console.log("*** CLIENTS LIST ***")
        if (result.rows.length != 0) {
            document.getElementById('show').innerHTML = "";
          for(var i = 0; i < result.rows.length; i++) {
            document.getElementById('show').innerHTML +=
            "<table><tr><td class = 'col-id'>" + result.rows.item(i)['id'] +
            "</td><td class = 'col-name'>" + result.rows.item(i)['name'] + 
            "</td><td class = 'col-phone'>" + result.rows.item(i)['phone'] + "</td></tr></table>";
            console.log(result.rows.item(i));
          }
        }
        else {
          document.getElementById('show').innerHTML = "Nothing to show here...";
        }
      }, null)
    })
  }
  else {
    document.getElementById('bshow').innerText = "Show";
    document.getElementById('show').innerHTML = "";
  }
}

function buttonAdd() {
  id = document.getElementById("form-add")['id'].value;
  name = document.getElementById("form-add")['name'].value;
  phone = document.getElementById("form-add")['phone'].value;
  db.transaction((tx) => {
    tx.executeSql("INSERT INTO 'clients' (id, name, phone) values(?, ?, ?)", [id, name , phone])
    },
    err => {
      console.log("Can't add client");
    },
    tx => {
      console.log("Client added");
    }
  );
  fill_select();
}

function deleteAll() {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM 'clients'")
    },
    err => console.log("Can't detele clients"),
    tx => console.log("Clients deleted")
  );
  fill_select();
  buttonShow();buttonShow();
}

function clear_form() {
  document.getElementById("form-add")['id'].value = "";
  document.getElementById("form-add")['name'].value = "";
  document.getElementById("form-add")['phone'].value = "";
}

function fill_select() {
  db.transaction(function(tx) {
    tx.executeSql("SELECT id FROM 'clients' ORDER BY ID", [], function(tx, result) {
      if (result.rows.length != 0) {
        document.getElementById('idselector').innerHTML = "";
        document.getElementById('idselector').innerHTML = "<option>Select id to delete</option>";
        for(var i = 0; i < result.rows.length; i++) {
          document.getElementById('idselector').innerHTML += "<option>" + result.rows.item(i)['id'] + "</option>";
          console.log(result.rows.item(i));
        }
      }
      else {
        document.getElementById('idselector').innerHTML = "<option>Nothing to select</option>";
      }
    }, null)
  })
}

function deleteById() {
  sel = document.getElementById('idselector');
  opt = sel.options[sel.selectedIndex].value;
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM 'clients' WHERE id=?", [opt])
    },
    err => console.log("Can't detele client"),
    tx => console.log("Client delete")
  );
  fill_select();
  buttonShow();buttonShow();
}