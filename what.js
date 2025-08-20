let music_count = 0

const instruments = [
    {n:"Dr",t:"L"},{n:"Timp",t:"L"},
    {n:"Glck",t:"M"},{n:"Xylo",t:"M"},{n:"Vib",t:"M"},{n:"Mrmb",t:"M"},
    {n:"Conga",t:"M"},{n:"Bongo",t:"M"},{n:"W.Chime",t:"M"},{n:"C.Cym",t:"M"},{n:"S.Cym",t:"M"},{n:"B.D.",t:"M"},{n:"Tom-Toms",t:"M"},{n:"S.D.",t:"M"},{n:"Gong",t:"M"},
    {n:"Tamb（皮あり）",t:"S"},{n:"Tamb（皮なし）",t:"S"},{n:"Tri",t:"S"},{n:"Cabasa",t:"S"},{n:"Shaker",t:"S"},{n:"Maracas",t:"S"},{n:"Clv",t:"S"},{n:"V.Slap",t:"S"},{n:"Slap",t:"S"},{n:"W.B.",t:"S"},{n:"Cowbell",t:"S"},{n:"Castanet",t:"S"},{n:"Agogo",t:"S"},{n:"F.Cym",t:"S"},{n:"Whistle",t:"S"},{n:"S.Bell",t:"S"},{n:"その他",t:"O"}
]

function addMusic(){
    music_count ++
    const add_place = document.getElementById("m_list")

    const m = document.createElement("div")
    m.className = "music"
    m.dataset.id = music_count

    const removeBtn = `<br><button class="remove-btn" onclick="this.parentNode.remove()">削除</button>`

    const music = `<label>曲名：<input type="text" name="name${music_count}" placeholder="入力"></label><br><br>`
    const check = instruments.map(f => 
        `<label><input type="checkbox" name="use${music_count}" value="${f.n}"> ${f.n}</label>`
    ).join(" ");
    
    m.innerHTML = music + "使用楽器：" + check + removeBtn
    
    add_place.appendChild(m)
}

function result(){

    //いったん使う楽器set配列を作る
    const set = new Set()
    for (let i = 1; i <= music_count; i++) {
        const use = Array.from(document.querySelectorAll(`input[name="use${i}"]:checked`))
                            .map(f => f.value);
        use.forEach(f => set.add(f));
    }

    //楽器の種類ごとにset作成
    let grouped = {};
    instruments.forEach(f => grouped[f.t] = new Set());
    //追加
    instruments.forEach(f => {
        if(set.has(f.n)){
            grouped[f.t].add(f.n)
        }
    })
    
    //出力
    let html = "";
    for (const type in grouped) {
        const items = Array.from(grouped[type]);
        if (items.length > 0) {
            let which = ""
            if (type == "L"){which = "メイン楽器"}
            if (type == "M"){which = "大きい楽器"}
            if (type == "S"){which = "小物"}
            if (type == "O"){which = "その他"}
            html += `<div class="group">
                     <h3>${which}</h3>
                     <p>${items.join(" , ")}</p>
                    </div>`;
        }
    }

    document.getElementById("result").innerHTML = html

    saveData()
}



function loadFromSave() {
    const text = document.getElementById("saveInput").value;
    const lines = text.split("\n").map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
        // 「・曲名 楽器」の形式を解析
        let match = line.match(/^・(.+?)\s+(.+)$/);
        if (!match) return;

        const name = match[1];
        const iText = match[2];
        const selected = iText.split(",").map(f => f.trim());

        // 新しい曲を追加
        addMusic();
        const id = music_count; // 今追加した曲の番号

        // 名前欄にセット
        document.querySelector(`input[name="name${id}"]`).value = name;

        // チェックボックスを選択
        selected.forEach(f => {
        const checkbox = document.querySelector(`input[name="use${id}"][value="${f}"]`);
        if (checkbox) checkbox.checked = true;
        });
    });

}

function saveData() {
    const lines = [];
    for (let i = 1; i <= music_count; i++) {
        const nameInput = document.querySelector(`input[name="name${i}"]`);
        const name = nameInput.value.trim();
        const selected = Array.from(document.querySelectorAll(`input[name="use${i}"]:checked`))
                            .map(f => f.value);
        if (name) lines.push(`・${name} ${selected.join(",")}`);
    }
    document.getElementById("saveOutput").value = lines.join("\n");
}

function copyOutput(){
    const copy = document.getElementById("saveOutput").value
    navigator.clipboard.writeText(copy).then(() => {
        alert(`コピーしました: 「${copy}」`);
    });
}