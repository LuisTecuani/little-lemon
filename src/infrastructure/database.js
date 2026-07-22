import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
    db.execAsync(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            price REAL, 
            image TEXT,
            description TEXT,
            category TEXT
        );
    `);
}

export async function getMenuItems() {
    return await db.getAllAsync('SELECT * FROM menu');
}

export async function saveMenuItems(menu) {
    await Promise.all(menu.map(async item => {
        await db.runAsync(`
            INSERT INTO menu ( name, price, image, description, category) 
            VALUES ( ?, ?, ?, ?, ?)
        `, [ item.name, item.price, item.image, item.description, item.category]);
    }));
    console.log('Menu saved');
}
