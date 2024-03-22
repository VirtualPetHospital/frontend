// userAuthority 与 role 的映射

export function getRole(auth) {
  let res = "";
  if (auth === 1) {
    res = "student";
  } else if (auth === 2) {
    res = "admin";
  } else if (auth === 3) {
    res = "teacher";
  }
  return res;
}
