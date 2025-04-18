import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // const Url = "http://localhost:5000/"; // Local server URL
  const Url = "https://backaitu.onrender.com/";
  
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
     fetch(Url + "login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: phone, password })
    })
      .then(response => {
        if (!response.ok) {
          // Try to parse error message from backend if available
          return response.json().then(errData => {
            throw new Error(errData.message || `HTTP error! Status: ${response.status}`);
          }).catch(() => {
            // Fallback if response is not JSON or parsing fails
            throw new Error(`HTTP error! Status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "success") {
          // NOTE: Authentication state is not persisted without localStorage.
          // User will need to log in again after refresh/closing tab.
          // Consider using Context, Zustand, Redux for in-memory state,
          // or server-side sessions with cookies for persistence.
          
          // Only navigate if the user is an admin
          if (data.admin === true) {
            // TODO: Update global state (e.g., via Context) to reflect logged-in status
            navigate("/", { replace: true });
          } else {
            setError("У вас нет прав доступа (требуется статус администратора)");
          }
        } else {
           // Handle potential backend error status
           setError(data.message || "Неизвестная ошибка входа.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Display specific error from response if available, otherwise generic network error
        setError(error.message || "Ошибка сети или сервера. Проверьте консоль.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-blue px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-md shadow-2xl p-10 my-8 border border-gray-200">
        <div className="mb-12 text-center">
          <img
            className="mx-auto mb-5 w-24 h-24 transition-transform duration-300 hover:scale-105"
            src="/src/img/aitu-logo.png"
            alt="Aitu Логотип"
          />
          <h1 className="text-2xl font-semibold text-gray-700">
            Войти в аккаунт
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Пожалуйста, войдите, чтобы продолжить
          </p>
        </div>
        {error && <div className="mb-4 text-center text-red-400 text-sm bg-red-50 p-2 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" value="Номер телефона" className="text-sm font-medium text-gray-600" />
            <TextInput
              id="phone"
              type="tel"
              placeholder="Номер телефона"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 text-base text-black transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-[#FAF6F7] rounded-md"
              sizing="lg"
              style={{ color: "black" }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" value="Пароль" className="text-sm font-medium text-gray-600" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 text-base text-black transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-[#FAF6F7] rounded-md"
              sizing="lg"
              style={{ color: "black" }}
            />
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-200 rounded focus:ring-blue-300 focus:ring-2"
              />
              <Label htmlFor="remember" value="Запомнить меня" className="ml-2 text-gray-600 text-sm" />
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200">
              Забыли пароль?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full mt-4 py-3 px-2 bg-[#242424] hover:bg-[#333333] transition-all duration-300 text-white font-medium text-base rounded-2xl shadow-md hover:shadow-lg"
            size="lg"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
