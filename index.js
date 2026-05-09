console.log("tes jalan");

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API BotLoop Jalan");
});

app.post("/register", (req, res) => {
    const { nama, kelas, email, password } = req.body;

    const sql = "INSERT INTO users (nama, kelas, email, password, role, saldo) VALUES (?, ?, ?, ?, 'user', 0)";
    
    db.query(sql, [nama, kelas, email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Gagal Register"
            });
        }

        res.json({
            message: "Register berhasil"
        });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                message: "server error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "user tidak ditemukan"
            });
        }

        const user = result[0];

        if (user.password !== password) {
            return res.status(401).json({
                message: "password salah"
            });
        }

        res.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                nama: user.nama,
                kelas: user.kelas,
                email: user.email,
                saldo: user.saldo,
                role: user.role,
                created_at: user.created_at
            }
        });
    });
});

app.get("/users/all", (req, res) => {
    const sql = "SELECT id, nama, kelas FROM users WHERE role = 'user'";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({message: "error"});
        res.json(result);
    });
});

app.get("/user/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, nama, kelas, email, saldo, role FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "error"});
        if (result.length === 0) return res.status(404).json({ message: "user tidak ditemukan" });
        res.json(result[0]);
    });
});

app.post("/setor", (req, res) => {
    const {user_id, berat} = req.body;

    if (!user_id || !berat) {
        return res.status(400).json({
            message: "user_id dan berat wajib diisi"
        });
    }

    const hargaPerKg = 3000;
    const jumlah = berat * hargaPerKg;

    //simpan transaksi
    const sqlTransaksi = `
    INSERT INTO transactions (user_id, tipe, jumlah, berat, harga_perkg, status) VALUES (?, 'setor', ?, ?, ?, 'approved')`;

    db.query(sqlTransaksi, [user_id, jumlah, berat, hargaPerKg], (err, result) => {
        if (err) 
            return res.status(500).json({message: "gagal setor"});

            const sqlUpdateSaldo = ` UPDATE users SET saldo = saldo + ? WHERE id = ?`;


        db.query(sqlUpdateSaldo, [jumlah, user_id], (err2) => {
            if (err2)
                return res.status(500).json({message: "gagal update saldo"});

            res.json({
                message : "setor berhasil", jumlah
            });
        });
    });
});

app.get("/riwayat/:user_id", (req, res) => {
    const {user_id} = req.params;

    const sql = ` SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`;

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "gagal mengambil riwayat"
            });
        }

        res.json({
            message: "riwayat berhasil diambil",
            data: result
        });
    });
});

app.post("/tarik", (req, res) => {
    const {user_id, jumlah} = req.body;

    if (!user_id || !jumlah) {
    return res.status(400).json({
        message: "user_id dan jumlah wajib diisi"
    });
}

    const sql = ` INSERT INTO transactions (user_id, tipe, jumlah, status) VALUES (?, 'tarik', ?, 'pending')`;

    db.query(sql, [user_id, jumlah], (err) => {
        if (err) {
            return res.status(500).json({message: "gagal tarik"});
        }

        res.json({
            message: "permintaan penarikan dikirim(menunggu admin)"
        });
    });
});

app.get("/admin/pending", (req, res) => {
    const sql = "SELECT * FROM transactions WHERE status = 'pending'";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "error"});
        }
        res.json(result);
    });
});

app.post("/admin/approve", (req, res) => {
    const {id} = req.body;

    const getTrans = "SELECT * FROM transactions WHERE id = ?";

    db.query(getTrans, [id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: "transaksi tidak ditemukan"});
        }
        
        const trx = result[0];
        const updateStatus = "UPDATE transactions SET status = 'approved' WHERE id = ?";

        db.query(updateStatus, [id], (err2) => {
            if (err2) {
                return res.status(500).json({ message: "gagal approve"});
            }

            if(trx.tipe === "tarik") {
                db.query("UPDATE users SET saldo = saldo - ? WHERE id = ?", [trx.jumlah, trx.user_id]);
            }
            res.json({ message: "transaksi di approve"});
        });
    });
});

app.get("/admin/riwayat", (req, res) => {
    const sql = "SELECT * FROM transactions ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "error" });
        res.json(result);
    });
});


app.get("/penarikan/pending",(req, res) => {
    const sql = ` SELECT t.*, u.nama, u.kelas 
    FROM transactions t 
    JOIN users u ON t.user_id = u.id 
    WHERE t.tipe = 'tarik' AND t.status = 'pending' 
    ORDER BY t.created_at DESC`;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "error "});

        res.json(result);
    });
});

app.get("/users", (req, res) => {
    const sql = "SELECT id, nama FROM users";

    db.query(sql, (err, result) => {
        if(err) return res.status(500).json({ message: "error"});

        res.json(result);
    });
});

app.listen(3000, () => {
    console.log("server runing on port 3000");
});