import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import TodoList from "../contracts/TodoList";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export const Todo = () => {
  let contract;
  let provider;
  let numberOfTasks;

  const address = TodoList.networks[5777].address;
  const abi = TodoList.abi;

  const [todo, setTodo] = React.useState("");
  const [taskList, setTaskList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const connect = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(address, abi, provider.getSigner());
  };

  const connectToDatabase = async () => {
    console.log(address, abi);

    if (window.ethereum) {
      // provider = new ethers.providers.Web3Provider(window.ethereum);
      // console.log(provider);
      // contract = new ethers.Contract(address, abi, provider.getSigner());
      // console.log(contract);
      // const number = await contract.numberOfTasks();
      // const tasks = await contract.tasks(2);
      // console.log(number.toString());
      // console.log(tasks.toString());
      await connect();
    } else {
      alert("Please connect to MetaMask");
    }
  };

  const handleAdd = async () => {
    await connect();
    setIsLoading(true);
    contract.addTask(todo).then(() => window.location.reload());
  };

  const handleGetTasks = async () => {
    console.log(contract);
    contract = new ethers.Contract(address, abi, provider.getSigner());
    const number = await contract.numberOfTasks();
    setTaskList([]);

    for (let i = 1; i <= number.toString(); i++) {
      const tasks = await contract.tasks(i);
      setTaskList((prev) => [...prev, tasks.toString()]);
      setIsLoading(true);
    }
    // setIsLoading(false);

    console.log(taskList);
    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
    // window.location.reload();
  };

  const handleToggle = async (id) => {
    await connect();
    setIsLoading(true);
    contract.toggleTask(id).then(() => {
      window.location.reload();
    });
  };

  const handleDelete = async (id) => {
    await connect();
    setIsLoading(true);
    contract.deleteTask(id).then(() => window.location.reload());
  };

  React.useEffect(() => connectToDatabase(), []);
  React.useEffect(() => handleGetTasks(), []);

  console.log(taskList);

  return (
    <div>
      <h2>Todo List || Dapp</h2>
      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <TextField
          label="Add Task"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          variant="outlined"
          fullWidth
        />
      </div>
      <br />

      <Button variant="contained" onClick={() => handleAdd()}>
        ADD
      </Button>
      <br />
      <br />

      {isLoading ? (
        <div>...Loading</div>
      ) : (
        taskList.map((task, index) => {
          task = task.split(",");
          return (
            +task[0] !== 0 && (
              <div
                key={index}
                style={{
                  border: "1px solid black",
                  width: "500px",
                  margin: "auto",
                  marginTop: "10px",
                  padding: "5px 5px",
                  borderRadius: "5px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>{task[1]}</div>
                <div>
                  <Switch
                    onChange={() => handleToggle(index + 1)}
                    checked={task[2] === "true"}
                  />
                  <IconButton>
                    <DeleteIcon onClick={() => handleDelete(index + 1)} />
                  </IconButton>
                </div>
                {/* <div>{task[2]}</div> */}
              </div>
            )
          );
        })
      )}
    </div>
  );
};
