import { ChangeEvent, useRef, useState } from "react";
import AiSearchView from "../../views/aiSearchView";
import { GoogleGenerativeAI } from "@google/generative-ai";

function AiSearch() {
  // Google AI
  const [reqImage, setReqImage] = useState<FileList | null>(null); // 질문 요청 이미지
  const [previewImage, setPreviewImage] = useState<string>("");
  const [reqContent, setReqContet] = useState(""); // 질문 요청 내용
  const [resContent, setResContent] = useState(""); // 질문 답변 내용
  const [viewBlock, setViewBlock] = useState<boolean>(false); // 응답 안내 블럭
  const [maxTokens, setMaxTokens] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // 구글 공식문서 코드 시작 -------------------------------------------------
  // 참고 공식문서 주소 https://ai.google.dev/tutorials/web_quickstart?hl=ko
  // Access your API key (see "Set up your API key" above)

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY!);

  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise: Promise<string> = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  // 아래 세팅값에 대한 공식문서 주소
  // https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini?hl=ko
  const generationConfig = {
    stopSequences: [],
    maxOutputTokens: maxTokens,
    temperature: 0.4,
    topP: 1.0,
    topK: 32,
  };

  async function run() {
    // For text-and-images input (multimodal), use the gemini-pro-vision model
    // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    let modelType = "gemini-pro-vision";

    if (!reqImage) modelType = "gemini-pro";

    const model = genAI.getGenerativeModel({ model: modelType, generationConfig });

    const prompt = reqContent;

    const fileInputEl = reqImage ? [reqImage[0]] : [];
    const imageParts = await Promise.all([...fileInputEl].map(fileToGenerativePart));

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();

    if (response.candidates && response.candidates[0]) {
      if (response.candidates[0].finishReason === "MAX_TOKENS") {
        alert("응답시간이 초과되었습니다.");
      }
    }

    setResContent(text);
    setViewBlock(false);
  }
  // 구글 공식문서 코드 끝 -------------------------------------------------

  // 저장된 내용으로 검색 요청
  const onSearch = () => {
    if (maxTokens <= 0) {
      alert("응답시간 토큰을 설정해주세요");
      return;
    }
    setViewBlock(true);
    run();
  };

  // 검색할 요청 이미지 저장
  const onImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setReqImage(e.target.files);

      var reader = new FileReader();
      reader.onload = function (e) {
        setPreviewImage(e.target ? String(e.target.result) : "");
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setReqImage(null);
      setPreviewImage("");
    }
  };

  // 질문할 내용 저장
  const onContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReqContet(e.target.value);
  };

  // 업로드한 이미지 삭제
  const onImageClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setReqImage(null);
    setPreviewImage("");
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

  const onMaxTokenSetting = (num: number) => {
    setMaxTokens(num);
  };

  return (
    <AiSearchView
      onSearch={onSearch}
      onImage={onImage}
      onContent={onContent}
      resContent={resContent}
      previewImage={previewImage}
      viewBlock={viewBlock}
      reqImage={reqImage}
      reqContent={reqContent}
      inputRef={inputRef}
      onClear={onClear}
      onImageClear={onImageClear}
      onSearchContentClear={onSearchContentClear}
      onMaxTokenSetting={onMaxTokenSetting}
    />
  );
}

export default AiSearch;
