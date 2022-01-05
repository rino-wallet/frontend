import sinon from "sinon";
import { expect } from "chai";
import pollTask from "../../src/utils/pollTask";
import tasksApi from "../../src/api/tasks";


describe("pollTask", function() {
  it("\"pollTask\" should call the server until the task completed", async () => {
    const stub = sinon.stub(tasksApi, "checkTask").resolves({ "status": "COMPLETED" });
    const data = await pollTask(1);
    expect(data.status).to.equal("COMPLETED");
    stub.restore();
  });
});
