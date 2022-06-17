import React, { useState } from "react";
import {
  Button,
  Input,
  TextArea,
  Checkbox,
  Label,
  Radio,
  Switch,
  Select,
  Tabs,
  Spinner,
  Status,
  Tooltip,
} from "../../components";
import { PageTemplate } from "../../modules/PageTemplate";
import { createPDF } from "./createPdf";

interface Props {
  value: number;
  onChange: (value: number) => void;
}
const SizeSettings: React.FC<Props> = ({ value, onChange }) => (
  <div className="mb-3">
    <span className="mr-3">Size: </span>
    <label className="mr-3">
      <input type="radio" checked={value === Button.size.SMALL} onClick={(): void => { onChange(Button.size.SMALL); }} />
      {" "}
      Small
    </label>
    <label className="mr-3">
      <input type="radio" checked={value === Button.size.MEDIUM} onClick={(): void => { onChange(Button.size.MEDIUM); }} />
      {" "}
      Medium
    </label>
    <label className="mr-3">
      <input type="radio" checked={value === Button.size.BIG} onClick={(): void => { onChange(Button.size.BIG); }} />
      {" "}
      Big
    </label>
  </div>
);

const ComponentsPage: React.FC = () => {
  const [buttonSize, setButtonSize] = useState(Button.size.MEDIUM);
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkedRadio, setCheckedRadio] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [tab, setTab] = useState(0);
  return (
    <PageTemplate title="Components">
      <div>
        <h2 className="text-2xl mb-4 mt-8">Tooltip</h2>
        <div>
          <Tooltip content="I'm tooltip. You can see me when you hover the button.">
            <Button variant={Button.variant.GRAY} size={Button.size.SMALL}>Hover me</Button>
          </Tooltip>
        </div>
        <h2 className="text-2xl mb-4 mt-8">PDF</h2>
        <Button
          variant={Button.variant.GRAY}
          size={buttonSize}
          onClick={(): void => {
            createPDF(
              { title: "Wallet Recovery Document", filename: "file.pdf", totalPages: 1 },
            );
          }}
        >
          Create pdf
        </Button>
        <h2 className="text-2xl mb-4 mt-8">Button</h2>
        <SizeSettings value={buttonSize} onChange={setButtonSize} />
        <div className="mb-3">
          <div className="mb-1"><Button variant={Button.variant.GRAY} size={buttonSize} loading>Add wallet</Button></div>
          <div className="mb-1"><Button variant={Button.variant.GRAY} size={buttonSize}>Add wallet</Button></div>
          <div className="mb-1"><Button variant={Button.variant.RED} size={buttonSize}>Delete</Button></div>
          <div className="mb-1"><Button variant={Button.variant.GREEN} size={buttonSize}>Confirm</Button></div>
          <div className="mb-1"><Button variant={Button.variant.PRIMARY} size={buttonSize}>Submit</Button></div>
          <div className="mb-1"><Button variant={Button.variant.PRIMARY_LIGHT} size={buttonSize}>Submit</Button></div>
          <div className="mb-1"><Button variant={Button.variant.PRIMARY_LIGHT} size={buttonSize} disabled>Submit</Button></div>
          <div className="mb-1"><Button variant={Button.variant.GRAY} size={buttonSize} icon>i</Button></div>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Input</h2>
        <div className="mb-3">
          <div className="mb-3">
            <Label label="Input">
              <Input
                type="text"
                placeholder="Placeholder"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
                value={inputValue}
              />
            </Label>
          </div>
          <Label label="Input">
            <Input
              type="text"
              placeholder="Placeholder"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
              value={inputValue}
              error="Error message"
            />
          </Label>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Textarea</h2>
        <div className="mb-2">
          <Label label="TextArea">
            <TextArea
              placeholder="Placeholder"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTextAreaValue(e.target.value)}
              value={textAreaValue}
            />
          </Label>
        </div>
        <div className="mb-2">
          <Label label="TextArea">
            <TextArea
              placeholder="Placeholder"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setTextAreaValue(e.target.value)}
              value={textAreaValue}
              error="Error message"
            />
          </Label>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Checkbox</h2>
        <div className="mb-2">
          <Checkbox checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setChecked(e.target.checked)}>
            Label
          </Checkbox>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Label</h2>
        <div className="mb-2">
          <Label label="Transaction time">
            <span className="text-sm">10:34, 01 Jun 2021</span>
          </Label>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Radio</h2>
        <div className="mb-2">
          <Radio checked={checkedRadio} value="red" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCheckedRadio(e.target.checked)}>
            Label
          </Radio>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Switch</h2>
        <div className="mb-2">
          <Switch id="switch" checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setChecked(e.target.checked)}>
            Label
          </Switch>
        </div>

        <h2 className="text-2xl mb-4 mt-8">Select</h2>
        <div className="mb-2">
          <Label label="Select">
            <Select
              value={selectValue}
              icon="eye"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => setSelectValue(e.target.value)}
            >
              <option value="" />
              <option value="xmr">XMR</option>
              <option value="btc">BTC</option>
              <option value="usd">USD</option>
            </Select>
          </Label>
        </div>
        <div className="mb-2">
          <Tabs
            tabs={[
              {
                value: 0,
                text: "Transactions",
              },
              {
                value: 1,
                text: "Users",
              },
              {
                value: 2,
                text: "Settings",
              },
            ]}
            activeTab={tab}
            onChange={(value): void => setTab(value)}
          >
            <div>
              Active tab:
              {tab}
            </div>
          </Tabs>
        </div>
        <div
          className="mb-2 relative"
          style={{
            width: "200px", height: "200px", border: "1px solid black", display: "flex",
          }}
        >
          <Spinner size={32} stub />
        </div>
        <div className="mb-2">
          <Spinner size={32} />
        </div>
        <div>
          <Status variant={Status.variant.GRAY}>Gray</Status>
          <Status variant={Status.variant.GREEN}>Green</Status>
          <Status variant={Status.variant.RED}>Red</Status>
          <Status variant={Status.variant.YELLOW}>Yellow</Status>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ComponentsPage;
