import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ReactWhatsapp from "react-whatsapp";
import { Timestamp } from "@firebase/firestore";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [date, setDate] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newFrom, setNewFrom] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newMobnum, setNewMobnum] = useState(0);
  const [newDate, setNewDate] = useState();
  const [newTime, setNewTime] = useState();
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "1");

  const createRide = async () => {
    await addDoc(usersCollectionRef, {
      to: newTo,
      from: newFrom,
      desc: newDesc,
      mobnum: newMobnum,
      datetime: newDate,
      time: newTime,
    });
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      // console.log(data.docs[1]._document.data.value.mapValue.fields);
      // console.log(
      //   data.docs[1]._document.data.value.mapValue.fields.desc.stringValue
      // );
      // setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(data);

      setList(data.docs);
    };
    getUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`From, ${from}`);
    console.log(`to, ${to}`);
    console.log(`date, ${date}`);
  };
  function func(seconds) {
    let ans = "";
    let daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let currYear,
      daysTillNow,
      extraTime,
      extraDays,
      index,
      date,
      month,
      flag = 0;

    // Calculate total days unix time T
    daysTillNow = parseInt(seconds / (24 * 60 * 60), 10);
    extraTime = seconds % (24 * 60 * 60);
    currYear = 1970;

    // Calculating current year
    while (daysTillNow >= 365) {
      if (currYear % 400 == 0 || (currYear % 4 == 0 && currYear % 100 != 0)) {
        daysTillNow -= 366;
      } else {
        daysTillNow -= 365;
      }
      currYear += 1;
    }

    // Updating extradays because it
    // will give days till previous day
    // and we have include current day
    extraDays = daysTillNow + 1;

    if (currYear % 400 == 0 || (currYear % 4 == 0 && currYear % 100 != 0))
      flag = 1;

    // Calculating MONTH and DATE
    month = 0;
    index = 0;
    if (flag == 1) {
      while (true) {
        if (index == 1) {
          if (extraDays - 29 < 0) break;

          month += 1;
          extraDays -= 29;
        } else {
          if (extraDays - daysOfMonth[index] < 0) {
            break;
          }
          month += 1;
          extraDays -= daysOfMonth[index];
        }
        index += 1;
      }
    } else {
      while (true) {
        if (extraDays - daysOfMonth[index] < 0) {
          break;
        }
        month += 1;
        extraDays -= daysOfMonth[index];
        index += 1;
      }
    }

    // Current Month
    if (extraDays > 0) {
      month += 1;
      date = extraDays;
    } else {
      if (month == 2 && flag == 1) date = 29;
      else {
        date = daysOfMonth[month - 1];
      }
    }

    // Calculating HH:MM:YYYY
    // hours = parseInt(extraTime / 3600, 10);
    // minutes = parseInt((extraTime % 3600) / 60, 10);
    // secondss = parseInt((extraTime % 3600) % 60, 10);

    ans += date.toString();
    ans += "-";
    ans += month.toString();
    ans += "-";
    ans += currYear.toString();
    // ans += " ";
    // ans += hours.toString();
    // ans += ":";
    // ans += minutes.toString();
    // ans += ":";
    // ans += secondss.toString();

    // Return the time
    return ans;
  }
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__container">
          Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="formarea">
        search <br />
        <form onSubmit={handleSubmit}>
          <label>
            {/* <input type="text" name="from" /> */}
            <select
              placeholder="From"
              onChange={(event) => {
                setFrom(event.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                From
              </option>
              <option>Vellore</option>
              <option>Chennai</option>
              <option>Bangalore</option>
            </select>
            {/* <input
              onChange={(e) => setFrom(e.target.value)}
              value={from}
            ></input> */}
          </label>
          <label>
            {/* <input type="text" name="to" /> */}
            <select
              placeholder="From"
              onChange={(event) => {
                setTo(event.target.value);
              }}
            >
              <option value="" disabled selected hidden>
                To
              </option>
              <option>Vellore</option>
              <option>Chennai</option>
              <option>Bangalore</option>
            </select>
          </label>
          <label>
            date:
            <input
              type="date"
              name="date"
              onChange={(event) => {
                setDate(event.target.value);
              }}
            />
          </label>
          {/* <input type="submit" value="Submit" /> */}
          <button type="submit">Click to submit</button>
        </form>
      </div>
      <div className="available-rides">
        <h1> Available rides:</h1>
        {list.length > 0 &&
          list.map((listitem) => {
            // console.log(listitem); // object hai

            // console.log(to);
            return (from == "" && to == "") ||
              (listitem._document.data.value.mapValue.fields.from
                .stringValue === from &&
                listitem._document.data.value.mapValue.fields.datetime
                  .integerValue == Math.floor(Date.parse(date) / 1000) &&
                listitem._document.data.value.mapValue.fields.to.stringValue ===
                  to) ? (
              <div>
                <p>
                  desc:{" "}
                  {
                    listitem._document.data.value.mapValue.fields.desc
                      .stringValue
                  }
                </p>
                <p>
                  from:{" "}
                  {
                    listitem._document.data.value.mapValue.fields.from
                      .stringValue
                  }
                </p>
                <p>
                  to:{" "}
                  {listitem._document.data.value.mapValue.fields.to.stringValue}
                </p>
                <p>
                  date time:{" "}
                  {func(
                    listitem._document.data.value.mapValue.fields.datetime
                      .integerValue
                  )}
                </p>
                <p>
                  time (24 hr format):{" "}
                  {
                    listitem._document.data.value.mapValue.fields.time
                      .stringValue
                  }
                </p>
                <p>
                  <ReactWhatsapp
                    number={
                      listitem._document.data.value.mapValue.fields.mobnum
                        .integerValue
                    }
                    message={`hey, i saw your entry on cab share site from ${
                      listitem._document.data.value.mapValue.fields.from
                        .stringValue
                    } to ${
                      listitem._document.data.value.mapValue.fields.to
                        .stringValue
                    } on ${func(
                      listitem._document.data.value.mapValue.fields.datetime
                        .integerValue
                    )} and would like to join you`}
                  >
                    Chat on Whatsapp
                  </ReactWhatsapp>
                </p>
              </div>
            ) : (
              <p> </p>
            );
          })}
      </div>
      <div className="newride">
        <h1>Can't find a suitable ride? Create a new ride! </h1>
        <select
          placeholder="To"
          onChange={(event) => {
            setNewTo(event.target.value);
          }}
        >
          <option value="" disabled selected hidden>
            To
          </option>
          <option>Vellore</option>
          <option>Chennai</option>
          <option>Bangalore</option>
        </select>

        <select
          placeholder="From"
          onChange={(event) => {
            setNewFrom(event.target.value);
          }}
        >
          <option value="" disabled selected hidden>
            From
          </option>
          <option>Vellore</option>
          <option>Chennai</option>
          <option>Bangalore</option>
        </select>
        <input
          // type="number"
          placeholder="Desc"
          onChange={(event) => {
            setNewDesc(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Mobile number"
          onChange={(event) => {
            setNewMobnum(Number(event.target.value));
          }}
        />
        <input
          type="date"
          placeholder="Date"
          onChange={(event) => {
            setNewDate(Math.floor(Date.parse(event.target.value) / 1000));
          }}
        />
        <input
          id="appt-time"
          type="time"
          name="appt-time"
          onChange={(event) => {
            setNewTime(event.target.value);
          }}
        ></input>

        <button onClick={createRide}> Create Ride</button>
      </div>
    </>
  );
}

export default Dashboard;
