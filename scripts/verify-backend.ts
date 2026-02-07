import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:5000";
let cookie = "";

async function request(path: string, options: any = {}) {
    const headers = { ...options.headers };
    if (cookie) {
        headers["Cookie"] = cookie;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
        cookie = setCookie.split(";")[0];
    }

    return res;
}

async function runTest() {
    console.log("Starting backend verification...");

    // 1. Register
    const username = `testuser_${Date.now()}`;
    const password = "password123";
    console.log(`\n1. Registering user: ${username}`);
    let res = await request("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (res.status === 201) {
        console.log("✅ Registration successful");
    } else {
        console.error("❌ Registration failed", await res.text());
        return;
    }

    // 2. Login (Should remain logged in from register, but testing login endpoint)
    // Logout first
    await request("/api/logout", { method: "POST" });
    cookie = "";

    console.log("\n2. Logging in...");
    res = await request("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
        console.log("✅ Login successful");
    } else {
        console.error("❌ Login failed", await res.text());
        return;
    }

    // 3. Analyze Text
    console.log("\n3. Analyzing text...");
    const text = "This is a test text to analyze. It should be saved to history.";
    res = await request("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, audience: "general", relationship: "peer" }),
    });

    if (res.status === 200) {
        const data = await res.json();
        console.log("✅ Analysis successful");
    } else {
        console.error("❌ Analysis failed", await res.text());
    }

    // 4. Get History
    console.log("\n4. Fetching history...");
    res = await request("/api/history");
    if (res.status === 200) {
        const history: any[] = await res.json();
        if (history.length > 0 && history[0].originalText === text) {
            console.log(`✅ History fetched successfully (${history.length} items)`);
        } else {
            console.error("❌ History mismatch or empty", history);
        }
    } else {
        console.error("❌ Failed to fetch history", await res.text());
    }

    // 5. Upload File
    console.log("\n5. Uploading file...");
    const fileName = "test-upload.txt";
    writeFileSync(fileName, "Content from uploaded file.");

    const formData = new FormData();
    const fileContent = new Blob(["Content from uploaded file."], { type: "text/plain" });
    formData.append("file", fileContent, fileName);

    res = await request("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (res.status === 200) {
        const data: any = await res.json();
        if (data.text.trim() === "Content from uploaded file.") {
            console.log("✅ File upload and extraction successful");
        } else {
            console.error("❌ File content mismatch", data);
        }
    } else {
        console.error("❌ File upload failed", await res.text());
    }

    unlinkSync(fileName);
    console.log("\nVerification complete!");
}

runTest().catch(console.error);
