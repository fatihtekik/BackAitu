import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Простейшая валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    setError("");
    // Логика аутентификации может быть добавлена здесь
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-blue px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <img
            className="mx-auto mb-4 w-20 h-20"
            src="/src/img/aitu-logo.png"
            alt="Aitu Логотип"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Войти в аккаунт
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Пожалуйста, войдите, чтобы продолжить
          </p>
        </div>
        {error && <div className="mb-4 text-center text-red-500 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <Label htmlFor="email" value="Электронная почта" />
            <TextInput
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" value="Пароль" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="remember" value="Запомнить меня" className="ml-2 text-gray-600" />
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Забыли пароль?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
