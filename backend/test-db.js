const { pool } = require("./db");

console.log("🔍 Testing Database Connectivity...\n");

(async () => {
    try {
        console.log("📋 Configuration:");
        console.log("DATABASE_URL:", process.env.DATABASE_URL);
        console.log("\nAttempting connection...\n");

        // Quick DNS check to detect IPv6-only hosts that can cause timeouts
        try {
            const { hostname } = new URL(process.env.DATABASE_URL);
            const dns = require('dns').promises;
            const records = await dns.lookup(hostname, { all: true });
            const hasIPv4 = records.some(r => r.family === 4);
            const hasIPv6 = records.some(r => r.family === 6);
            console.log(`\n🔎 DNS for host ${hostname}:`, records.map(r => `${r.address} (v${r.family})`));
            if (hasIPv6 && !hasIPv4) {
                console.warn('\n⚠️ Host resolves to IPv6 only. This environment may lack IPv6 connectivity which causes timeouts.');
                console.warn('Options: enable IPv6 on your machine/network, try from another network, or ask your DB provider for an IPv4 endpoint.');
            }
        } catch (dnsErr) {
            // ignore DNS check errors and continue to attempt connection
        }

        const result = await pool.query("SELECT NOW()");
        console.log("✅ DATABASE CONNECTION SUCCESSFUL!");
        console.log("Current database time:", result.rows[0]);

        // Test tables exist
        console.log("\n📊 Checking tables...\n");

        const usersTable = await pool.query(
            "SELECT to_regclass('public.users')"
        );
        const tasksTable = await pool.query(
            "SELECT to_regclass('public.tasks')"
        );

        if (usersTable.rows[0].to_regclass) {
            console.log("✅ Users table exists");
        } else {
            console.log("❌ Users table NOT found - Run schema.sql");
        }

        if (tasksTable.rows[0].to_regclass) {
            console.log("✅ Tasks table exists");
        } else {
            console.log("❌ Tasks table NOT found - Run schema.sql");
        }

        // Count rows
        if (usersTable.rows[0].to_regclass) {
            const userCount = await pool.query("SELECT COUNT(*) FROM users");
            console.log(`\n👥 Users in database: ${userCount.rows[0].count}`);
        }

        if (tasksTable.rows[0].to_regclass) {
            const taskCount = await pool.query("SELECT COUNT(*) FROM tasks");
            console.log(`📝 Tasks in database: ${taskCount.rows[0].count}`);
        }

        console.log("\n✨ Database setup complete and working!\n");
        process.exit(0);
    } catch (error) {
        console.error("❌ CONNECTION FAILED\n");
        console.error("Error:", error.message);
        console.error("\n💡 TROUBLESHOOTING:");
        console.error("1. Is DATABASE_URL in correct format?");
        console.error("   Format: postgresql://user:password@host:port/database");
        console.error("\n2. For Supabase:");
        console.error("   - Go to Settings > Database > Connection Strings");
        console.error("   - Copy the 'Connection String' (URI)");
        console.error("   - Replace [password] with your database password");
        console.error("   - Update .env with this URL");
        console.error("\n3. Is your database server running?");
        console.error("   - For Supabase: Check project status");
        console.error("   - For local: psql should be running");
        console.error("\n4. Did you run schema.sql?");
        console.error("   - Tables must be created first");
        process.exit(1);
    }
})();
