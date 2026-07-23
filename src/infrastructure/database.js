import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon');

export async function createTable() {
    await db.execAsync(`
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

export async function findByCategories(categories) {
    if (categories.length === 0) {
        return await getMenuItems();
    }
    const placeholders = categories.map(() => '?').join(',');
    const query = `SELECT * FROM menu WHERE category IN (${placeholders})`;
    return await db.getAllAsync(query, categories);
}

export async function findBySearchTerm(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return await getMenuItems();
    }
    return await db.getAllAsync('SELECT * FROM menu WHERE name LIKE ?', [`%${searchTerm}%`]);
}

