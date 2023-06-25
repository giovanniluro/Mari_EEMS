import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 1.5rem;
  align-content: flex-start;
  justify-content: space-between;
  background: #EAEAEA;
  font-family: 'Roboto', sans-serif;
  color: #282828;

  label {
    display: flex;
    flex-direction: column;

    > span {
      margin: 8px 0;
      font-weight: bold;
    }
  }

  h4 {
    margin-top: 16px;
    margin-bottom: 8px;
  }

  button {
    display: flex;
    cursor: pointer;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: #282828;
    color: #EAEAEA;
    border: 0;
    outline: 0;
    opacity: 1;
    transition: all .2s;

    &:hover {
      opacity: 0.9;
    }
  }
`

export const InputGroup = styled.div`
  display: flex;
  width: 48%;
`

export const InputContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
`

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 500px;
  overflow: auto;

  table  {
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid;

    padding: 6px;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    border-radius: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 8px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
    border-radius: 8px;
  }
`