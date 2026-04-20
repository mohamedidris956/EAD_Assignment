export const loginUser = async (email, password) => {
  const res = await fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};