import pollTask from "../../utils/pollTask";

jest.mock("../../api/tasks", () => ({
  checkTask: () => Promise.resolve({ "status": "COMPLETED" })
}));


describe("pollTask", function() {
  it("\"pollTask\" should call the server until the task completed", async () => {
    const data = await pollTask("1");
    expect(data.status).toEqual("COMPLETED");
  });
});
