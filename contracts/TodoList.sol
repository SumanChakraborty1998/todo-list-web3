// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract TodoList {
  uint256 public numberOfTasks = 0;

  struct Task {
    uint256 id;
    string description;
    bool completed;
  }

  mapping(uint256 => Task) public tasks;

  event TaskCreated(uint256 id, string description, bool completed);

  constructor() {
    addTask("Buy milk");  // 1
  }

  function addTask(string memory _description) public {
    numberOfTasks++;
    tasks[numberOfTasks] = Task(numberOfTasks, _description, false);
    emit TaskCreated(numberOfTasks, _description, false);
  }

  function toggleTask(uint256 _id) external {
    tasks[_id].completed = !tasks[_id].completed;
  }

  function deleteTask(uint256 _id) external {
    delete tasks[_id];
  }

}