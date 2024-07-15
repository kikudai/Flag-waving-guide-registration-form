import React, { useEffect, useState } from 'react';
import DatePicker from './components/DatePicker';
import DataList from './components/DataList';
import ImageOverlay from './components/ImageOverlay';
import './assets/styles/main.css';
import './assets/styles/mobile.css';
import './assets/styles/desktop.css';

// 型定義
interface ColumnIndexes {
  [key: string]: number;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [locationsTimeSlots, setLocationsTimeSlots] = useState<Map<string, string>>(new Map());
  const [locationsFormUrl, setLocationsFormUrl] = useState<Map<string, string>>(new Map());
  const [fullData, setFullData] = useState<string[][]>([]);
  const [columnIndexes, setColumnIndexes] = useState<ColumnIndexes>({});

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      console.log('Initializing the app...');
      await fetchLocationsAndTimeSlots();
      await fetchDataAndDisplay();
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    } catch (error) {
      console.error('Error initializing the app:', error);
    }
  };

  const fetchLocationsAndTimeSlots = async () => {
    const range = 'locations!A1:C22';
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/function-1?range=${range}`);
    const data = await response.json();
    const locationsTimeSlots = new Map<string, string>();
    const locationsFormUrl = new Map<string, string>();
    data.values.slice(1).forEach((row: string[]) => {
      locationsTimeSlots.set(row[0], row[1]);
      locationsFormUrl.set(row[0], row[2]);
    });
    setLocationsTimeSlots(locationsTimeSlots);
    setLocationsFormUrl(locationsFormUrl);
  };

  const fetchDataAndDisplay = async () => {
    const range = 'formData!B1:C1000';
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/function-1?range=${range}`);
    const data = await response.json();
    processSpreadsheetData(data.values);
  };

  const processSpreadsheetData = (values: string[][]) => {
    const columnIndexes: ColumnIndexes = {};
    values[0].forEach((column, index) => {
      columnIndexes[column] = index;
    });
    setColumnIndexes(columnIndexes);
    setFullData(values.slice(1));
  };

  const filterAndDisplayData = (selectedDate: string) => {
    const dateIndex = columnIndexes['対応可能日付'];
    const filteredData = fullData.filter(row => row[dateIndex] === selectedDate);
    return filteredData;
  };

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  return (
    <div>
      <h1>[安全指導]旗振り場所・対応者数リスト</h1>
      <ImageOverlay />
      <DatePicker onDateChange={handleDateChange} />
      <DataList 
        data={filterAndDisplayData(selectedDate)} 
        selectedDate={selectedDate} 
        locationsTimeSlots={locationsTimeSlots} 
        locationsFormUrl={locationsFormUrl} 
        columnIndexes={columnIndexes} 
      />
    </div>
  );
};

export default App;
