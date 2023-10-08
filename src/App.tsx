import React, { useEffect, useRef } from 'react';
import './App.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Box, Button, Typography } from '@mui/material'; // TableRowを追加
import { Scrypt, ScryptProvider, SensiletSigner, toByteString } from 'scrypt-ts';
import { Voting, } from './contracts/voting';

// iPhone画像のパス
const iphoneImagePath = process.env.PUBLIC_URL + '/IPhone.png';

// Android画像のパス
const androidImagePath = process.env.PUBLIC_URL + '/Android.png';

function App() {

  const signerRef = useRef<SensiletSigner>()
  const [error, setError] = React.useState<string>("")
  const [contract, setContract] = React.useState<Voting>()




  useEffect(() => {
    const provider = new ScryptProvider()
    const signer = new SensiletSigner(provider);

    signerRef.current = signer

    fetchContract()
  }, [])

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Voting,
        {
          txId: "65993c82f930124f85dee1cdd88c60d802781d7821171eba44902d33194b5a7c",
          outputIndex: 0,
        }
      ).then((instance) => setContract(instance))
    } catch (error: any) {
      console.log("error while fetching contract: ", error)
      setError(error.message)
    }
  }

  async function vote(event: any) {

    await fetchContract()

    const signer = signerRef.current as SensiletSigner

    if (contract && signer) {
      const { isAuthenticated, error } = await signer.requestAuth()
      if (!isAuthenticated) {
        throw new Error(error)
      }

      await contract.connect(signer)

      const nextInstance = contract.next()

      const candidateName = event.target.name
      if (candidateName == "IPhone") {
        nextInstance.candidates[0].votesRecieved++
      } else if (candidateName == "Android") {
        nextInstance.candidates[1].votesRecieved++
      }

      console.log("contract.balance = " + contract.balance)

      contract.methods.vote(
        toByteString(candidateName, true),
        {
          next: {
            instance: nextInstance,
            balance: contract.balance
          }
        }
      ).then(result => {
        console.log(result.tx.id)
      }).catch(error => {
        setError(error.message)
        console.error(error)
      })

      await fetchContract()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <TableContainer
          component={Paper}
          variant="outlined"
          style={{ width: '1200', height: '80vh', margin: 'auto' }}
        >

          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>
                  <Typography variant='h4'>

                    iPhone
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  <Typography variant='h4'>
                    Android
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  <Box>
                    <Box
                      sx={{
                        height: 200,
                      }}
                      component="img"
                      alt={"IPhone"}
                      src={iphoneImagePath}
                    >
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Box>
                    <Box
                      sx={{
                        height: 200,
                      }}
                      component="img"
                      alt={"Android"}
                      src={androidImagePath}
                    >
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='center'>
                  <Box>
                    <Typography variant='h3'>
                      {contract?.candidates[0].votesRecieved.toString()}
                    </Typography>
                    <Button
                      variant='text'
                      name="IPhone"
                      onClick={vote}
                    >
                      Like!

                    </Button>
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Box>
                    <Typography variant='h3'>
                      {contract?.candidates[1].votesRecieved.toString()}
                    </Typography>
                    <Button
                      variant='text'
                      name="Android"
                      onClick={vote}
                    >
                      Like!
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

        </TableContainer>
      </header >
    </div >
  );
}

export default App;
