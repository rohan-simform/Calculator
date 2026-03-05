export const history = {
    toggleHistory() {
        let box = document.getElementById("history-box");
        box.style.display = box.style.display === "none" ? "block" : "none";
    },

    addHistory(expr, result) {
        let historyData = JSON.parse(localStorage.getItem("calcHistory") || "[]");

        historyData = [expr + " = " + result, ...historyData];

        if (historyData.length > 20) historyData.pop();

        localStorage.setItem("calcHistory", JSON.stringify(historyData));

        this.renderHistory();
    },

    renderHistory() {
        let list = document.getElementById("history-list");
        let historyData = JSON.parse(localStorage.getItem("calcHistory") || "[]");

        if (historyData.length === 0) {
            list.innerHTML = '<li class="text-muted">No history yet.</li>';
            return;
        }

        list.innerHTML = "";

        historyData.forEach(i => {
            let li = document.createElement("li");
            li.textContent = i;
            list.appendChild(li);
        });
    },

    clearHistory() {
        localStorage.setItem("calcHistory", JSON.stringify([]));
        this.renderHistory();
    }
};