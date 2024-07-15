import React from 'react';

// 型定義
interface DataListProps {
  data: string[][];
  selectedDate: string;
  locationsTimeSlots: Map<string, string>;
  locationsFormUrl: Map<string, string>;
  columnIndexes: { [key: string]: number };
}

const DataList: React.FC<DataListProps> = ({ data, selectedDate, locationsTimeSlots, locationsFormUrl, columnIndexes }) => {
  const prepareGroupedData = () => {
    const locationIndex = columnIndexes['旗振り指導場所'];
    const groupedData: { [key: string]: { [key: string]: string[][] } } = {};
    locationsTimeSlots.forEach((timeSlot, location) => {
      if (!groupedData[location]) {
        groupedData[location] = {};
      }
      groupedData[location][timeSlot] = [];
    });
    data.forEach(row => {
      const location = row[locationIndex];
      groupedData[location][locationsTimeSlots.get(location)!].push(row);
    });
    return groupedData;
  };

  const groupedData = prepareGroupedData();

  return (
    <div id="spreadsheetData" className="data-list">
      {Object.keys(groupedData).map((location, locationIndex) => {
        const indicatorColors = ['orange', 'green', 'red'];
        const indicatorColor = indicatorColors[locationIndex % indicatorColors.length];
        return (
          <a href={locationsFormUrl.get(location)} target="_blank" className="data-item-link" key={location} rel="noopener noreferrer">
            <div className="data-item">
              <div className={`indicator ${indicatorColor}`} />
              <div className="data-location">{location}</div>
              {Object.keys(groupedData[location]).map(timeSlot => {
                const names = groupedData[location][timeSlot];
                const count = names.length;
                return (
                  <React.Fragment key={timeSlot}>
                    <div className="time-slot-area">
                      <div className="data-time-slot">{timeSlot}</div>
                      <div className="data-date">{selectedDate}</div>
                    </div>
                    <div className="data-count-area">
                      <span className="data-count">{count}</span>
                      <span className="unit">人</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default DataList;
