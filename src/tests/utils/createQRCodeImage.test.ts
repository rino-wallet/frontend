import createQRCodeImage from "../../utils/createQRCodeImage";

describe("createQRCodeImage", function () {
  it("createQRCodeImage returns base64 image", async () => {
    expect(await createQRCodeImage("Hello World")).toEqual("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKdSURBVO3BQY7cQAwEwSxC//9yeo48NSBIs17TjIgfrDGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1y8VASfpLKHUnoVLokdCpdEn6SyhPFGqVYoxRrlIuXqbwpCb+JypuS8KZijVKsUYo1ysWXJeEOlTuS0Kn8pCTcofJNxRqlWKMUa5SLYZLQqXRJmKxYoxRrlGKNcjGMyolKl4RJijVKsUYp1igXX6byNyXhROUJld+kWKMUa5RijXLxsiT8ZipdEjqVkyT8ZsUapVijFGuU+ME/LAknKv+TYo1SrFGKNcrFQ0noVLokvEmlU7kjCZ3KSRLepPJNxRqlWKMUa5SLL1PpknCHykkSOpU7kvA3JaFTeaJYoxRrlGKNEj94URKeUOmScKLSJaFTOUnCHSonSbhD5U3FGqVYoxRrlIuHktCpdEnoVLoknKicJOGOJNyhcpKEO1S+qVijFGuUYo0SP3hREk5U7khCp/KmJNyh8qYkdCpPFGuUYo1SrFHiB/+wJHQqXRI6lS4JncoTSehUflKxRinWKMUaJX7wQBJ+ksoTSehUTpLQqdyRhBOVNxVrlGKNUqxRLl6m8qYknCShUzlROUlCp9IloVPpknBHEjqVJ4o1SrFGKdYoF1+WhDtUvikJnUqn0iXhDpU7kvCmYo1SrFGKNcrFMEk4UemS8EQSTlROVN5UrFGKNUqxRrkYTuUOlZMkdConSehUvqlYoxRrlGKNcvFlKt+kcpKETuUkCZ1Kp9Il4Tcp1ijFGqVYo1y8LAk/KQmdykkSTlS6JHQqJyonSehU3lSsUYo1SrFGiR+sMYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijfIHfREA5mJl58EAAAAASUVORK5CYII=");
  });
  it("createQRCodeImage returns empty string when can't create base64 image", async () => {
    expect(await createQRCodeImage("")).toEqual("");
  });
  it("createQRCodeImage returns empty string for too long message", async () => {
    expect(await createQRCodeImage("1".repeat(10000))).toEqual("");
  });
});