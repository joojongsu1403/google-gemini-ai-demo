import { ChangeEvent } from "react";
import styled from "styled-components";
import { AiSearchViewBlock } from "../aiSearchView";

interface OpenAiViewInterface {
  onRun: () => void;
  onImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onContent: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onSearchContentClear: () => void;
  reqContent: string;
  resContent: string;
  viewBlock: boolean;
}

function OpenAiView(props: OpenAiViewInterface) {
  return (
    <OpenAiViewBlock>
      <section className="useView">
        <div className="header">
          <h1>OpenAI GPT-3.5-TURBO</h1>
        </div>
        <label>{/* <input type="file" onChange={(e) => props.onImage(e)} /> */}</label>
        <div>
          <textarea
            value={props.reqContent}
            onChange={(e) => props.onContent(e)}
            placeholder="검색 내용을 입력해주세요."
          ></textarea>
        </div>
        <div className="btn-box">
          <button
            className={!props.reqContent ? "clear-check" : "reset"}
            type="button"
            onClick={props.onClear}
          >
            검색내용 초기화
          </button>
          <button type="button" onClick={props.onRun}>
            검색
          </button>
        </div>
        <div>
          <textarea value={props.resContent ?? ""} readOnly />
        </div>
        <div className="btn-box">
          <button
            className={!props.resContent ? "clear-check" : "reset"}
            type="button"
            onClick={props.onSearchContentClear}
          >
            답변 초기화
          </button>
        </div>
      </section>
      {props.viewBlock && <section className="blockView">응답을 기다리고 있습니다.</section>}
    </OpenAiViewBlock>
  );
}

export default OpenAiView;

const OpenAiViewBlock = styled(AiSearchViewBlock)`
  padding-left: 0;
`;
