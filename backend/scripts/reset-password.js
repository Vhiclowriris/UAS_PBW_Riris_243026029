// backend/scripts/reset-password.js
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function resetPassword() {
  try {
    console.log('🔐 Generating hash baru untuk password123...');
    
    // Generate hash baru
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('✅ Hash baru:', hash);
    console.log('📏 Panjang hash:', hash.length);
    
    // Update ke database
    console.log('\n🔄 Updating database...');
    
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hash, 'owner1']
    );
    
    console.log('✅ Rows affected:', result.affectedRows);
    
    if (result.affectedRows > 0) {
      console.log('\n🎉 BERHASIL! Password owner1 sudah direset.');
      console.log('Silakan coba login lagi dengan:');
      console.log('Username: owner1');
      console.log('Password: password123');
    } else {
      console.log('\n❌ User owner1 tidak ditemukan di database!');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();