import { useState } from "react";
const axios = require("axios");

const isEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const index = () => {
  const [input, setInput] = useState({
    userName: "",
    userEmail: "",
    userPass: "",
    receiverEmail: "",
  });

  const handlerInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, ":", value);
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const { userName, userEmail, userPass, receiverEmail } = input;
    try {
      if (!userName || userName === "") {
        throw new Error("some field is missing (client side)");
      }
      if (!userEmail || userEmail === "") {
        throw new Error("some field is missing (client side)");
      }
      if (!userPass || userPass === "") {
        throw new Error("some field is missing (client side)");
      }
      if (!receiverEmail || receiverEmail === "") {
        throw new Error("some field is missing (client side)");
      }

      // // comment bcz want to send multiple email
      // if (!isEmail.test(userEmail) || !isEmail.test(receiverEmail)) {
      //   throw new Error("email is invalid format");
      // }

      const sendProcess = await axios.post("http://localhost:8000/send", {
        userName: userName,
        userEmail: userEmail,
        userPass: userPass,
        receiverEmail: receiverEmail,
      });

      // console.log(sendProcess.data);
      if (sendProcess) {
        window.alert("Send Complete");
      }
    } catch (error) {
      console.dir(error);
    }
  };

  return (
    <>
      <div>
        <h3>Send Message To Email</h3>
        <form>
          <p>Sender Name</p>
          <input
            type="text"
            placeholder="Enter user name"
            onChange={(e) => handlerInputChange(e)}
            name="userName"
            value={input.userName}
          />
          <p>Sender Email</p>
          <input
            type="text"
            placeholder="Enter user email"
            onChange={(e) => handlerInputChange(e)}
            name="userEmail"
            value={input.userEmail}
          />
          <p>Sender Password</p>
          <input
            type="password"
            placeholder="Enter user password"
            onChange={(e) => handlerInputChange(e)}
            name="userPass"
            value={input.userPass}
          />
          <p>Receiver Email</p>
          <input
            type="text"
            placeholder="Enter receiver email"
            onChange={(e) => handlerInputChange(e)}
            name="receiverEmail"
            value={input.receiverEmail}
          />
          <button type="submit" tabIndex="-1" onClick={(e) => sendEmail(e)}>
            Send
          </button>
        </form>
      </div>

      <style jsx>
        {`
          * {
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
          }

          h3 {
            padding-bottom: 1.5rem;
          }

          div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: auto;
            width: max-content;
          }

          form {
            display: flex;
            flex-direction: column;
            row-gap: 15px;
          }

          button {
            margin-top: 1.5rem;
            padding: 1rem 0;
          }
        `}
      </style>
    </>
  );
};

export default index;
