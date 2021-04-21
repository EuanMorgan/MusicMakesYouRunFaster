import styled from "styled-components";

export const Paragraph = styled.p`
  font-size: 1rem;

  @media (max-width: 858px) {
    width: 80vw;
  }
`;

export const ParagraphLarger = styled.p`
  font-size: 1.5rem;

  @media (max-width: 858px) {
    width: 80vw;
  }
`;

export const ParagraphContainer = styled.div`
  max-width: 50vw;
  margin: auto;

  @media (max-width: 858px) {
    max-width: 80vw;
  }
`;
