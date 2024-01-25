import { ChangeEvent, useState } from "react";
import OpenAiView from "../../views/openAiView";
import OpenAI from "openai";
// import ImageJS from "image-js";
// import fs from "fs";

function OpenAi() {
  // Open AI
  const [reqImage, setReqImage] = useState<File[]>([]); // 질문 요청 이미지
  const [reqContent, setReqContet] = useState(""); // 질문 요청 내용
  const [resContent, setResContent] = useState(""); // 질문 답변 내용
  const [viewBlock, setViewBlock] = useState<boolean>(false);

  // openAi 공식문서 코드 시작 --------------------------------------------
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true, // 같은 브라우저 여러 화면 허용
  });

  async function main() {
    // 이미지와 질문을 아래 모양대로 만들어 message 요청에 content에 반영
    // 현재 gpt 4 이하는 이미지 관련 정보를 지원하지 않는 것으로 확인
    // const textArray = [
    //   {
    //     type: "text",
    //     text: reqContent,
    //   },
    //   {
    //     type: "image_url",
    //     image_url: {
    //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
    //     },
    //   },
    // ];

    const stream = await openai.beta.chat.completions.stream({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: reqContent }],
      stream: true,
    });

    // 글자를 실시간 조회
    stream.on("content", (delta, snapshot) => {
      //   console.log(delta);
    });

    // 요청이 완료된 시점에서 데이터 정리 리턴
    const chatCompletion = await stream.finalChatCompletion();
    // console.log(chatCompletion.choices.at(-1)?.message.content); // {id: "…", choices: […], …}
    setResContent(chatCompletion.choices.at(-1)?.message.content as string);
    setViewBlock(false);
  }

  // openAi 공식문서 코드 끝 --------------------------------------------

  const onRun = () => {
    main();
    setViewBlock(true);
  };

  // 검색할 요청 이미지 저장
  const onImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0].arrayBuffer().then((e) => console.log(e)));
      setReqImage([e.target.files[0]]);
    }
  };

  // 질문할 내용 저장
  const onContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReqContet(e.target.value);
  };

  // 전부 초기화
  const onClear = () => {
    if (!reqContent) return;
    setReqContet("");
  };

  // ai 답변 삭제
  const onSearchContentClear = () => {
    if (!resContent) return;
    setResContent("");
  };

  return (
    <OpenAiView
      onRun={onRun}
      onImage={onImage}
      onContent={onContent}
      reqContent={reqContent}
      resContent={resContent}
      viewBlock={viewBlock}
      onClear={onClear}
      onSearchContentClear={onSearchContentClear}
    />
  );
}

export default OpenAi;
