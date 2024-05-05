$(document).ready(function() {
    var daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    var locationsTimeSlots = []; // 場所と時間帯のリスト

    // アプリの初期化を行う関数
    async function initialize() {
        try {
            console.log('Initializing the app...');
            await initializeDateDropdown(); // 日付ドロップダウンの初期化
            await fetchLocationsAndTimeSlots(); // 場所と時間帯のデータ取得
            await fetchDataAndDisplay(); // スプレッドシートからデータを取得して表示

            var initialDate = $('#dateFilter').val();
            filterAndDisplayData(initialDate); // 初期日付でデータをフィルタリングして表示
            setupImageClickHandler(); // 画像クリックハンドラをセットアップ
        } catch (error) {
            console.error('Error initializing the app:', error);
            // エラー処理のコードをここに追加することができます。
            // 例えば、ユーザーにエラーメッセージを表示するなど。
        }
    }

    // 日付プルダウンメニューを初期化
    function initializeDateDropdown() {
        var today = new Date();
    
        flatpickr("#dateFilter", {
            dateFormat: "Y/m/d", // 内部的に使用するフォーマット
            defaultDate: today,
            minDate: today,
            altInput: true, // 代替のインプットを有効にする
            altFormat: "Y/m/d (D)", // 表示用のフォーマット ('D'は曜日を表す)
            altInputClass: 'calendar-input', // 代替インプットに適用するカスタムクラス
            locale: {
                firstDayOfWeek: 0, // 日曜始まりに設定
                weekdays: {
                    shorthand: ['日', '月', '火', '水', '木', '金', '土'], // 曜日の短縮形
                    longhand: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'] // 曜日の完全な名前
                }
            },
            onChange: function(selectedDates, dateStr, instance) {
                filterAndDisplayData(dateStr); // 日付が変更されたらフィルタリングと表示を更新
            }
        });
    }
    
    // 場所と時間帯のマスタデータを取得
    function fetchLocationsAndTimeSlots() {
        var range = 'locations!A1:C22';
        return $.ajax({
            url: `https://asia-northeast1-test-p-420714.cloudfunctions.net/getSpreadSheet?range=${range}`,
            method: 'GET',
        }).then(function(response) {
            locationsTimeSlots = new Map();
            locationsFormUrl = new Map();
            response.values.slice(1).map(row => {
                locationsTimeSlots.set(row[0], row[1]);
                locationsFormUrl.set(row[0], row[2]);
            });
        });
    }

    // スプレッドシートからデータを取得して処理
    function fetchDataAndDisplay() {
        var range = 'formData!B1:D400';
        return $.ajax({
            url: `https://asia-northeast1-test-p-420714.cloudfunctions.net/getSpreadSheet?range=${range}`,
            method: 'GET',
        }).then(function(response) {
            processSpreadsheetData(response.values);
        });
    }

    // スプレッドシートデータを処理してインデックスを作成
    function processSpreadsheetData(values) {
        window.columnIndexes = {};
        values[0].forEach((column, index) => {
            window.columnIndexes[column] = index;
        });
        window.fullData = values.slice(1);
    }

    // 選択された日付に基づいてデータをフィルタリングし表示
    function filterAndDisplayData(selectedDate) {
        var dateIndex = window.columnIndexes['対応可能日付'];
        var filteredData = window.fullData.filter(row => row[dateIndex] === selectedDate);
        displayData(filteredData, selectedDate);
    }

    // データを表示する関数
    function displayData(data, selectedDate) {
        var nameIndex = window.columnIndexes['誘導者名前'];
        var groupedData = prepareGroupedData(data, selectedDate, nameIndex);
        var html = buildHtmlForGroupedData(groupedData, nameIndex, selectedDate); // ここで selectedDate を渡す
        $('#spreadsheetData').html(html);
    }

    // データをグループ化
    function prepareGroupedData(data, selectedDate, nameIndex) {
        var locationIndex = window.columnIndexes['旗振り指導場所'];
        /*
         * {
         *     "場所1": {
         *         "7:45 - 8:05": []
         *     }
         * }
         */
        var groupedData = {};
        locationsTimeSlots.forEach((timeSlot, location) => {
            if (!groupedData[location]) {
                groupedData[location] = {};
            }
            groupedData[location][timeSlot] = [];
        });
        data.forEach(row => {
            var location = row[locationIndex];
            groupedData[location][locationsTimeSlots.get(location)].push(row);
        });
        return groupedData;
    }

    // HTMLを構築する関数
    function buildHtmlForGroupedData(groupedData, nameIndex, selectedDate) {
        // インジケーターの色を定義
        const indicatorColors = ['orange', 'green', 'red'];
        
        var html = '';
        var locationIndex = 0; // 場所のインデックス

        Object.keys(groupedData).forEach(location => {
            // 場所のインデックスに基づいて色を割り当てる
            var indicatorColor = indicatorColors[locationIndex % indicatorColors.length];
            html += `
                <a href="${locationsFormUrl.get(location)}" target="_blank" class="data-item-link">
                    <div class="data-item">
                        <div class="indicator ${indicatorColor}"></div>
                        <div class="data-location">${location}</div>
                `;

            Object.keys(groupedData[location]).forEach(timeSlot => {
                var names = groupedData[location][timeSlot];
                var count = names.length;
                html += `
                        <div class="time-slot-area">
                            <div class="data-time-slot">${timeSlot}</div>
                            <div class="data-date">${selectedDate}</div>
                        </div>
                        <div class="data-count-area">
                            <span class="data-count">${count}</span>
                            <span class="unit">人</span>
                        </div>
                `;
            });

            html += `
                    </div>
                </a>
            `;
            locationIndex++; // 次の場所の色を選択するためインデックスを増やす
        });

        return html;
    }

    function setupImageClickHandler() {
        $('#clickableImage').click(function() {
            // 画像のソースを取得
            var src = $(this).attr('src');
            // オーバーレイ内の画像にソースを設定
            $('#fullSizeImage').attr('src', src);
            // オーバーレイを表示
            $('#imageOverlay').show();
        });
    
        // オーバーレイをクリックで非表示にする
        $('#imageOverlay').click(function(e) {
            if (e.target.id === 'imageOverlay' || e.target.id === 'fullSizeImage') {
                $(this).hide();
            }
        });
    }

    // 全体の初期化を行う
    initialize();

    // 日付変更時のイベントを再バインド
    $('#dateFilter').on('change', function() {
        filterAndDisplayData($(this).val());
    });
});
