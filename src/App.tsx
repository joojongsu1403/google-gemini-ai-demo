import styled from "styled-components";
import "./App.css";
import AiSearch from "./container/aiSearch";
import OpenAi from "./container/openAi";

function App() {
  return (
    <AppBlock>
      {/* google gemini ai */}
      <AiSearch />
      {/* openai gpt-3.5-turbo */}
      {/* <OpenAi /> */}
    </AppBlock>
  );
}

export default App;

const AppBlock = styled.div`
  width: 90%;
  min-width: 1000px;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 0 auto;
`;
