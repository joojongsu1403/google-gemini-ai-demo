import { ChangeEvent, MutableRefObject, RefObject } from "react";
import styled from "styled-components";

interface AiSearchInterface {
  onSearch: () => void;
  onImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onContent: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onImageClear: () => void;
  onSearchContentClear: () => void;
  onMaxTokenSetting: (num: number) => void;
  resContent: string;
  previewImage: string;
  viewBlock: boolean;
  reqImage: FileList | null;
  reqContent: string;
  inputRef: RefObject<HTMLInputElement>;
}

function AiSearchView(props: AiSearchInterface) {
  return (
    <AiSearchViewBlock>
      <section className="useView">
        <div className="header">
          <h1>GoogleAI gemini-pro-vision</h1>
        </div>
        <label>
          {props.previewImage && props.previewImage !== "" && (
            <img src={props.previewImage} alt="검색할 이미지" />
          )}
          {!props.reqImage && (
            <input
              ref={props.inputRef}
              type="file"
              onChange={(e) => {
                e.preventDefault();
                props.onImage(e);
              }}
            />
          )}
          <div>
            {props.reqImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  props.onImageClear();
                }}
              >
                이미지 초기화
              </button>
            )}
          </div>
        </label>
        <div>
          <textarea
            value={props.reqContent}
            onChange={(e) => props.onContent(e)}
            placeholder="검색 내용을 입력해주세요."
          ></textarea>
        </div>

        <div className="btn-box">
          <button
            className={!props.reqContent && !props.reqImage ? "clear-check" : "reset"}
            type="button"
            onClick={props.onClear}
          >
            검색텍스트 초기화
          </button>
          <button type="button" onClick={props.onSearch}>
            검색
          </button>
        </div>
        <div>
          <textarea value={props.resContent ?? ""} readOnly />
        </div>
        <div className="btn-box">
          <label>
            응답시간(maxOutputTokens)설정:{" "}
            <input
              type="number"
              placeholder="gemini-pro-vision 범위: 1-2048"
              onChange={(e) => {
                props.onMaxTokenSetting(Number(e.target.value));
              }}
            />
          </label>
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
    </AiSearchViewBlock>
  );
}

export default AiSearchView;

export const AiSearchViewBlock = styled.div`
  width: calc(100% / 2);
  height: 100%;
  padding: 18px;
  position: relative;

  & > .blockView {
    width: 100%;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 900;
  }

  & > .useView {
    background-color: #f7f7f7;
    height: 100%;
    padding: 24px;
    border: 1px solid #ddd;
    overflow-y: auto;
    &:nth-child(1) {
      margin-bottom: 20px;
    }

    & > label {
      width: 100%;
      min-height: 30px;
      margin-bottom: 20px;
      display: inline-block;
      & > img {
        width: 100%;
        max-width: 300px;
        height: auto;
      }
      & > div {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        & > button {
          min-width: 100px;
          padding: 8px 12px;
          color: #fff;
          background-color: #4486f9;
          border: 2px solid #fff;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 700;
        }
      }
    }
    & > div {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      & > textarea {
        width: 100%;
        min-height: 200px;
        border: 1px solid #ddd;
        border-radius: 5px;
        resize: none;
        padding: 12px;
        &:focus {
          outline: none;
        }
      }
      & > button {
        min-width: 100px;
        padding: 8px 12px;
        color: #fff;
        background-color: #4486f9;
        border: 2px solid #fff;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 700;
        margin-left: 5px;
      }
      & > .reset {
        background-color: #de6969;
      }
      & > .clear-check {
        background-color: #aaa;
        cursor: default;
      }
    }
    & > .header {
      background-color: #4486f9;
      color: #fff;
      border-radius: 5px;
      margin-bottom: 50px;
      border: 4px solid #fff;
    }
    & > .btn-box {
      justify-content: flex-end;
      & > label {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 12px;
      }
    }
  }
`;
