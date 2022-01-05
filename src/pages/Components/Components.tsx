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
} from "../../components";
import { PageTemplate } from "../../modules/PageTemplate";

const ComponentsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [checkedRadio, setCheckedRadio] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [tab, setTab] = useState(0);
  return <PageTemplate title="Components">
    <div>
      <div className="mb-2">
       <Button variant={Button.variant.GRAY} size={Button.size.BIG}>Big button</Button>
      </div>
      <div className="mb-2">
       <Button variant={Button.variant.GRAY} size={Button.size.BIG} disabled loading>Big button</Button>
      </div>
      <div className="mb-2">
        <Button variant={Button.variant.RED} size={Button.size.MEDIUM}>Medium button</Button>
      </div>
      <div className="mb-2">
        <Button variant={Button.variant.GREEN} size={Button.size.SMALL}>Small button</Button>
      </div>
      <div className="mb-2">
        <Button variant={Button.variant.GREEN} size={Button.size.BIG} rounded>i</Button>
      </div>
      <div className="mb-2">
        <Label label="Input">
          <Input
            size={Button.size.BIG}
            type="text"
            placeholder="Placeholder"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
            value={inputValue}
          />
        </Label>
      </div>
      <div className="mb-2">
        <Label label="Input">
          <Input
            size={Button.size.BIG}
            type="text"
            placeholder="Placeholder"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
            value={inputValue}
            error="Error message"
          />
        </Label>
      </div>
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
      <div className="mb-2">
        <Checkbox checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setChecked(e.target.checked)}>
          Label
        </Checkbox>
      </div>
      <div className="mb-2">
        <Label label="Transaction time">
          <span className="text-sm">10:34, 01 Jun 2021</span>
        </Label>
      </div>
      <div className="mb-2">
        <Radio checked={checkedRadio} value="red" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCheckedRadio(e.target.checked)}>
          Label
        </Radio>
      </div>
      <div className="mb-2">
        <Switch id="switch" checked={checked} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setChecked(e.target.checked)}>
          Label
        </Switch>
      </div>
      <div className="mb-2">
        <Label label="Select">
          <Select
            value={selectValue}
            size={Button.size.BIG}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => setSelectValue(e.target.value)}
          >
            <option value=""></option>
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
            }
          ]}
          activeTab={tab}
          onChange={(value): void => setTab(value)}
        >
          <div>Active tab: {tab}</div>
        </Tabs>  
      </div>
      <div className="mb-2">
        <div className="m-3 w-12 h-12 text-center bg-custom-pink-100">pink-100</div>
        <div className="m-3 w-12 h-12 text-center bg-custom-pink-200">pink-200</div>
        <div className="m-3 w-12 h-12 text-center bg-custom-pink-300">pink-300</div>
        <div className="m-3 w-12 h-12 text-center bg-custom-purple-100">purple-100</div>
        <div className="m-3 w-12 h-12 text-center bg-custom-purple-200">purple-200</div>
        <div className="m-3 w-12 h-12 text-center bg-custom-purple-300">purple-300</div>
      </div>  
      <div className="mb-2 relative" style={{ width: "200px", height: "200px", border: "1px solid black", display: "flex" }}>
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
}

export default ComponentsPage;
