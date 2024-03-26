import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div>
        <Routes> {/* 注意这里使用Routes替代了Switch */}
          <Route path="/" element={<HomePage />} /> {/* 更新Route的用法 */}
          {/* 可以继续添加更多的路由规则 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
