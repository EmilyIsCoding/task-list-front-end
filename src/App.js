import React, { useEffect } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

const taskDataList = [
  {
    id: 1,
    title: 'Mow the lawn',
    isComplete: false,
  },
  {
    id: 2,
    title: 'Cook Pasta',
    isComplete: true,
  },
];

const kBaseUrl = 'http://localhost:5000';

const convertFromApi = (apiTask) => {
  const { toggleComplete, ...rest } = apiTask;

  const newTask = { toggleComplete: false, ...rest };
  return newTask;
};

const getAllTasksApi = () => {
  return axios
    .get(`${kBaseUrl}/tasks`)
    .then((response) => {
      return response.data.map(convertFromApi);
    })
    .catch((err) => {
      console.log(err);
    });
};

const toggleComplete = (id) => {
  return axios
    .patch(`${kBaseUrl}/tasks/${id}/complete`)
    .then((response) => {
      return convertFromApi(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const removeTaskApi = (id) => {
  return axios
    .delete(`${kBaseUrl}/tasks/${id}`)
    .then((response) => {
      return convertFromApi(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const App = () => {
  const [taskData, setTaskData] = useState(taskDataList);

  const getAllTasks = () => {
    return getAllTasksApi().then((tasks) => {
      setTaskData(tasks);
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const toggleComplete = (id) => {
    return toggleComplete(id).then((taskResult) => {
      setTaskData((taskData) =>
        taskData.map((task) => {
          if (task.id == taskResult.id) {
            return { ...task, isComplete: !task.isComplete };
          } else {
            return task;
          }
        })
      );
    });
  };

  const removeTask = (id) => {
    return removeTaskApi(id).then((taskResult) => {
      taskData.filter((task) => {
        return task.id !== id;
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList
            tasks={taskData}
            onComplete={toggleComplete}
            onRemove={removeTask}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
