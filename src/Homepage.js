import React, { useState, useEffect } from "react";
import Data from "./Response.json";
import TitleData from "./ResponseLiftHeader.json";
import moment from "moment/moment";

const Homepage = () => {
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [highLightIndex, setHighLightIndex] = useState([null, null, null]);
  const [jsonData, setData] = useState(Data);
  const [showDataView, setShowDataView] = useState("rates");
  const [roomType, setRoomType] = useState("");
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

  let holiday = [];

  function changPrice(e, iIndex, jIndex, kIndex) {
    let temp = Object.assign({}, jsonData);
    temp.list.data[iIndex][jIndex][kIndex][0].rates = e.target.value;
    setData(temp);
  }

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
  Data.list.inventory[0].forEach((item, index) => {
    if (
      moment(item.date).format("d") === "6" ||
      moment(item.date).format("d") === "0"
    ) {
      holiday.push(index);
    }
  }); // 歸類六日

  function cleanButton() {
    if (!localStorage.getItem("countryItem")) {
      setData(Data);
    } else {
      let getData = localStorage.getItem("countryItem");
      let getDataAry = JSON.parse(getData);
      setData(getDataAry);
    }
  }

  function submitButton() {
    let countryString = JSON.stringify(jsonData);
    localStorage.setItem("countryItem", countryString);
  }

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
        <button type="button" className="button" onClick={cleanButton}>
          清除目前所輸入的值
        </button>
        <button type="button" className="button" onClick={submitButton}>
          save
        </button>
      </div>
      <table>
        <tbody>
          <tr className="heard">
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
                  <p>{moment(date.date).format("ddd")}</p>
                  <p>{moment(date.date).format("D")}</p>
                  <p>{moment(date.date).format("MMM ")}</p>
                </td>
              </>
            ))}
          </tr>
          {jsonData.list.data.map((res, iIndex) => (
            <>
              <tr className="bodyBorder border-collapse  ">
                <th
                  className={`textJustify ${
                    TitleData.list[iIndex].roomtype === roomType ||
                    roomType === ""
                      ? ""
                      : "datadisplay"
                  }`}
                >
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
                    {uaData.aval}
                  </th>
                ))}
              </tr>
              {res.map((resData, jIndex) => (
                <tr>
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
                    {TitleData.list[iIndex].ratedata[jIndex].display_name}
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
                    >
                      <input
                        onChange={(event) =>
                          changPrice(event, iIndex, jIndex, kIndex)
                        }
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
