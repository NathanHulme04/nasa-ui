import styled from 'styled-components';

export const ApodCardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
`;

export const ApodShowButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    text-decoration: underline;
  }
`; 