import { Selector } from 'testcafe';

let id = 0;
const deviceMainBox = Selector('div.device-main-box');
const deviceNames = Selector('span.device-name');
const deviceType = Selector('span.device-type');
const deviceCapacity = Selector('span.device-capacity');
const buttonEdit = Selector(`#root > div > div > div.list-devices-main > div > div:nth-child(${id+1}) > div.device-options > a`);
const buttonRemove = Selector(`#root > div > div > div.list-devices-main > div > div:nth-child(${id+1}) > div.device-options > button`);

fixture('list of devices')
    .page('http://localhost:3001/');

test('Check count and existence of devices', async t => {
    await t.wait(5000);
    const count = await deviceMainBox.count;
    console.log('Cantidad de dispositivos', count);

    let listaDivs = [];

    for (let i = 0; i < count; i++) {
        const name = await deviceNames.nth(i).innerText;
        const type = await deviceType.nth(i).innerText;
        const capacity = await deviceCapacity.nth(i).innerText;
        id = i;

        listaDivs.push({ id, name, type, capacity });
    }

    console.log(listaDivs);

    for (let i = 0; i < listaDivs.length; i++) {
        const { name, type, capacity } = listaDivs[i];

        await t.expect(deviceNames.withText(name).exists).ok(`El dispositivo "${name}" no se encuentra en la página`);
        await t.expect(deviceType.withText(type).exists).ok(`El tipo de dispositivo "${type}" no se encuentra en la página`);
        await t.expect(deviceCapacity.withText(capacity).exists).ok(`La capacidad de dispositivo "${capacity}" no se encuentra en la página`);
        await t.expect(buttonEdit.exists).ok(`El boton "Edit" para el dispositivo "${name}" no se encuentra en la pagina`);
        await t.expect(buttonRemove.exists).ok(`El boton "Remove" para el dispositivo "${name}" no se encuentra en la pagina`);

        await t.expect(deviceNames.withText(name).visible).ok(`El dispositivo "${name}" no es visible en la página`);
        await t.expect(deviceType.withText(type).visible).ok(`El tipo de dispositivo "${type}" no es visible en la página`);
        await t.expect(deviceCapacity.withText(capacity).visible).ok(`La capacidad de dispositivo "${capacity}" no es visible en la página`);
        await t.expect(buttonEdit.visible).ok(`El boton "Edit" para el dispositivo "${name}" no es visible en la pagina`);
        await t.expect(buttonRemove.visible).ok(`El boton "Remove" para el dispositivo "${name}" no es visible en la pagina`);
        
    }
});

test('Click ADD DEVICE button', async t => {
 const nuevo = "NEW DEVICE"
 const type = "WINDOWS_WORKSTATION"
 const capacity = "25"
  // Click en le boton ADD DEVICE
  await t.click(Selector('a').withText('ADD DEVICE'));

  // Rellenar y seleccionar los campos
  await t.typeText('#system_name', nuevo)
         .click('#type')
         .click(Selector(`option[value=${type}]`))
         .typeText('#hdd_capacity', capacity);

  // Click en SAVE button
  await t.click(Selector('button').withText('SAVE'));

  await t.navigateTo('http://localhost:3001');

    // Verifica que existe el nuevo dispositivo
    await t.expect(deviceMainBox.withText(nuevo).exists).ok();

    // Verifica el nombre del dispositivo
    await t.expect(deviceNames.withText(nuevo).exists).ok();
    console.log(`${nuevo} encontrado`);
  
    // Verifica el tipo de dispositivo
    await t.expect(deviceType.withText('WINDOWS WORKSTATION').exists).ok();
    console.log(`Nuevo dispositivo con Type correcto`);
  
    // Verifica la capacidad del disco duro del dispositivo
    await t.expect(deviceCapacity.withText('25').exists).ok()
    console.log(`Nuevo dispositivo con Almacenamiento correcto`);
});

test('Test Edit button', async t => {
  
  // Click en le boton ADD DEVICE
  await t.click(Selector('#root > div > div > div.list-devices-main > div > div:nth-child(1) > div.device-options > a'));


  // Rellenar y seleccionar los campos
  const inputElement = Selector('#system_name');
  await t.selectText(inputElement).pressKey('delete');
  await t.typeText('#system_name', 'Rename Device');

  // Click en  UPDATE button
  await t.click(Selector('button').withText('UPDATE'));

  // Verifica que existe el dispositivo Rename Device
  await t.wait(1000);
  await t.expect(deviceMainBox.withText('Rename Device').exists).ok('No se encontro el dispositivo');
  console.log(`El dispositivo "Rename Device" existe en la pagina.`);
});

test('Remove last device from the list', async t => {
 
    let name = '';


    await t.wait(1000);

    const count = await deviceMainBox.count;
    
    let listaUpdate = [];

    for (let i = 0; i < count; i++) {
         name = await deviceNames.nth(i).innerText;
         const type = await deviceType.nth(i).innerText;
         const capacity = await deviceCapacity.nth(i).innerText;
         id = i;

        listaUpdate.push({ id, name, type, capacity });
    }

    // Obtener el ID del último dispositivo de la lista
    const lastDevice = listaUpdate[listaUpdate.length - 1];
    const { id2, name2 } = lastDevice;
    console.log(`Eliminando el dispositivo "${name}" con ID: ${id}`);
  
    // Hacer clic en el botón "Remove" del último dispositivo
    await t.click(`#root > div > div > div.list-devices-main > div > div:nth-child(${id+1}) > div.device-options > button`);
  
    // Verificar que el dispositivo ya no existe en la página
    await t.wait(1000);
    await t.expect(deviceMainBox.withText(name).exists).notOk();
    console.log(`El dispositivo "${name}" fue eliminado de la lista.`);
});
