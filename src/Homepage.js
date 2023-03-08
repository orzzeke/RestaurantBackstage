import React, { useState, useEffect } from "react";
import Data from "./Response.json"; // 原始資料
import TitleData from "./ResponseLiftHeader.json"; // 原始標題資料
import moment from "moment/moment";

const Homepage = () => {
  // 顯示或隱藏加減乘除
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  // 定位各個表格內容的位置
  const [highLightIndex, setHighLightIndex] = useState([null, null, null]);
  // 把原始資料綁監聽
  const [jsonData, setData] = useState(Data);
  // select 選擇價格
  const [showDataView, setShowDataView] = useState("rates");
  // roomType 的選擇
  const [roomType, setRoomType] = useState("");
  // 為了對應每隔input跟同列的資料綁定 做的迴圈
  // 把每格input 輸入的時候都更改陣列的內容 預設為1(乘法)
  // 做成二維陣列
  const [multiplyPrice, setMultiplyPrice] = useState(function () {
    const row = [];
    jsonData.list.data.map((res) => {
      const coul = [];
      res.map((respone) => {
        coul.push("1");
      });
      row.push(coul);
    });
    return row;
  });
  const [addPrice, setAddPrice] = useState(function () {
    const row = [];
    jsonData.list.data.map((res) => {
      const coul = [];
      res.map((respone) => {
        coul.push("0");
      });
      row.push(coul);
    });
    return row;
  });

  // 給屬於六日的index 放值的陣列
  let holiday = [];

  // 更動值不動原陣列原則 把原本陣列 引入temp內
  // i j k 做定位可以抓輸入的值在json的位置 然後改變
  // 最後在導回去Data
  function changPrice(e, iIndex, jIndex, kIndex) {
    let temp = Object.assign({}, jsonData);
    temp.list.data[iIndex][jIndex][kIndex][0].rates = e.target.value;
    setData(temp);
  }
  // 取 乘法預設的陣列 導進該列位置
  function setMultiply(e, i, j) {
    let temp = [...multiplyPrice];
    temp[i][j] = e;
    setMultiplyPrice(temp);
  }

  function setAdd(e, i, j) {
    let temp = [...addPrice];
    temp[i][j] = e;
    setAddPrice(temp);
  }

  // input 裡面的值 3個if 為了做價格改變時功能依舊
  // 分別為 rates extraadult extrachild
  // 先把第一格的金額取出 用map跑陣列數量的迴圈把值帶進去
  function updataPrice(i, j) {
    if (showDataView === "rates") {
      let price = Number(jsonData.list.data[i][j][0][0].rates);
      let temp = Object.assign({}, jsonData);
      jsonData.list.data[i][j].map(
        (d) =>
          (d[0].rates =
            price * Number(multiplyPrice[i][j]) + Number(addPrice[i][j]))
      );
      setData(temp);
    } else if (showDataView === "extraadult") {
      let price = Number(jsonData.list.data[i][j][0][0].extraadult);
      let temp = Object.assign({}, jsonData);
      jsonData.list.data[i][j].map(
        (d) =>
          (d[0].extraadult =
            price * Number(multiplyPrice[i][j]) + Number(addPrice[i][j]))
      );
      setData(temp);
    } else if (showDataView === "extrachild") {
      let price = Number(jsonData.list.data[i][j][0][0].extrachild);
      let temp = Object.assign({}, jsonData);
      jsonData.list.data[i][j].map(
        (d) =>
          (d[0].extrachild =
            price * Number(multiplyPrice[i][j]) + Number(addPrice[i][j]))
      );
      setData(temp);
    }
  }
  // 歸類六日
  Data.list.inventory[0].forEach((item, index) => {
    if (
      moment(item.date).format("d") === "6" ||
      moment(item.date).format("d") === "0"
    ) {
      holiday.push(index);
    }
  });

  // 把input 尚未儲值的值 變回儲存之前的樣子
  // 如果本機有之前儲存的資料就拿出來沒有的話就把本地資料導入
  // countryItem 為儲存時候的key 值

  function cleanButton() {
    if (!localStorage.getItem("countryItem")) {
      setData(Data);
    } else {
      let getData = localStorage.getItem("countryItem");
      let getDataAry = JSON.parse(getData);
      setData(getDataAry);
    }
  }

  // 把資料存進本地端
  // 本地資料端只能存字串 先轉字串
  // 再放進key值為 countryItem 的地方
  function submitButton() {
    let countryString = JSON.stringify(jsonData);
    localStorage.setItem("countryItem", countryString);
  }

  // 渲染時如果線上端沒資料就拿本地端塞進去
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("countryItem"));
    if (items) {
      setData(items);
    } else {
      setData(Data);
    }
  }, []);

  return (
    <div className="wrap">
      <div>
        {/* 選擇顯示不同的價格 */}
        <select
          className="select"
          defaultValue="--select--"
          onChange={(e) => setShowDataView(e.target.value)}
        >
          <option
            disabled="disabled"
            defaultValue="--select--"
            style={{ backgroundColor: "	#E0E0E0" }}
          >
            --select--
          </option>
          <option value="rates">rates</option>
          <option value="extraadult">extraadult</option>
          <option value="extrachild">extrachild</option>
        </select>
        {/* 選擇roomTypr */}
        <select
          className="select"
          defaultValue="--select roomtpye--"
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option style={{ backgroundColor: "	#E0E0E0" }} disabled="disabled">
            --select roomtpye--
          </option>
          <option value="">ALL</option>
          <option value="Deluxe Standard Twin">Deluxe Standard Twin</option>
          <option value="Luxury Room">Luxury Room</option>
          <option value="Superior Family">Superior Family</option>
          <option value="Superior Queen">Superior Queen</option>
          <option value="test">test</option>
        </select>
        {/* 清除尚未儲存的部分 */}
        <button type="button" className="button" onClick={cleanButton}>
          清除目前所輸入的值
        </button>
        {/* 把目前有輸入的值儲存到本地端 */}
        <button type="button" className="button" onClick={submitButton}>
          save
        </button>
      </div>
      <table>
        <tbody>
          <tr className="heard">
            {/* 取最左邊的日期當左上角的顯示 */}
            <td>{Data.list.inventory[0][0].date}</td>
            {Data.list.inventory[0].map((date, hIndex) => (
              <>
                {/* 日期列 */}
                <td
                  className={`
                  ${hIndex === highLightIndex[2] ? "baccBlue" : ""}
                  ${holiday.includes(hIndex) ? "holidayBaccColor" : ""} 
                  `}
                >
                  {/* 把時間格式轉換 */}
                  <p>{moment(date.date).format("ddd")}</p>
                  <p>{moment(date.date).format("D")}</p>
                  <p>{moment(date.date).format("MMM ")}</p>
                </td>
              </>
            ))}
          </tr>
          {/* 第一層map 拆解 */}
          {jsonData.list.data.map((res, iIndex) => (
            <>
              <tr className="bodyBorder border-collapse  ">
                {/* className 變換roomType時 有跟選擇的一樣 就不會隱藏 */}
                <th
                  className={`textJustify ${
                    TitleData.list[iIndex].roomtype === roomType ||
                    roomType === ""
                      ? ""
                      : "datadisplay"
                  }`}
                >
                  {/* 第一欄的值 */}
                  <p style={{ display: "inline" }}>
                    {TitleData.list[iIndex].roomtype}
                  </p>
                  <button
                    onClick={() => setShowDiscountForm(!showDiscountForm)}
                    type="button"
                  >
                    <img
                      alt="icon"
                      src="https://img.icons8.com/ios/50/null/formula-fx.png"
                      width={"20px"}
                    ></img>
                  </button>
                </th>
                {/* 第二層 map */}
                {Data.list.inventory[iIndex].map((uaData, uaIndex) => (
                  <th
                    className={`${
                      TitleData.list[iIndex].roomtype === roomType ||
                      roomType === ""
                        ? ""
                        : "datadisplay"
                    }
                  ${holiday.includes(uaIndex) ? "holidayBaccColor" : ""} 
                  ${uaData.aval === "0" ? "textRed" : "textBlue"}`}
                  >
                    {/* holiday 抓是六日的話背景顏色要變 */}
                    {/* uaData 有 0/NA 做變色 */}
                    {uaData.aval}
                  </th>
                ))}
              </tr>
              {/* 第三層 */}
              {res.map((resData, jIndex) => (
                <tr>
                  {/* 第二個判斷再寫抓迴圈位子做hover的效果 */}
                  <td
                    className={`${
                      TitleData.list[iIndex].roomtype === roomType ||
                      roomType === ""
                        ? ""
                        : "datadisplay"
                    }
                    ${
                      iIndex === highLightIndex[0] &&
                      jIndex === highLightIndex[1]
                        ? "baccBlue"
                        : ""
                    }`}
                    style={{ textAlign: "left" }}
                  >
                    {/* 左邊標題不是黑體字的顯示區塊 */}
                    {TitleData.list[iIndex].ratedata[jIndex].display_name}
                    {/* form 表單隱藏或顯示 各會把自己本身的位置帶上去上面陣列做存放 */}
                    {showDiscountForm && (
                      <form className="textRight">
                        x{" "}
                        <input
                          defaultValue={1}
                          onChange={(e) =>
                            setMultiply(e.target.value, iIndex, jIndex)
                          }
                        ></input>{" "}
                        +{" "}
                        <input
                          defaultValue={0}
                          onChange={(e) =>
                            setAdd(e.target.value, iIndex, jIndex)
                          }
                        ></input>
                        <button
                          type="button"
                          onClick={() => updataPrice(iIndex, jIndex)}
                          style={{ backgroundColor: "white", border: "none" }}
                        >
                          <img
                            alt="icon"
                            src="https://img.icons8.com/small/16/000000/go.png"
                          />
                        </button>
                      </form>
                    )}
                  </td>
                  {/* 第四層 拆解 */}
                  {resData.map((dateData, kIndex) => (
                    <td
                      className={`
                      ${
                        TitleData.list[iIndex].roomtype === roomType ||
                        roomType === ""
                          ? ""
                          : "datadisplay"
                      }
                      ${holiday.includes(kIndex) ? "holidayBaccColor" : ""}`}
                      onMouseEnter={() =>
                        setHighLightIndex([iIndex, jIndex, kIndex])
                      }
                      // onMouseEnter 滑鼠事件 觸發 把該滑鼠碰到的迴圈位子傳上去
                    >
                      <input
                        onChange={(event) =>
                          changPrice(event, iIndex, jIndex, kIndex)
                        }
                        // value 判斷價格選擇的顯示
                        value={`${
                          showDataView === "rates" ? dateData[0].rates : ""
                        }${
                          showDataView === "extraadult"
                            ? dateData[0].extraadult
                            : ""
                        }${
                          showDataView === "extrachild"
                            ? dateData[0].extrachild
                            : ""
                        }`}
                      ></input>{" "}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Homepage;
