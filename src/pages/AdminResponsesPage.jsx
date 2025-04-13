import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminResponsesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const result = await axios.get('/api/responses', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResponses(result.data);
      } catch (err) {
        console.error('Error loading responses:', err);
        setError('Failed to load responses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [authToken]);

  const handleViewResponse = (id) => {
    navigate(`/admin/responses/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Questionnaire Responses
      </Typography>

      {responses.length === 0 ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            No responses have been submitted yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Submitted</strong></TableCell>
                <TableCell><strong>Marketing</strong></TableCell>
                <TableCell><strong>Analysis</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id} hover>
                  <TableCell>{response.userEmail}</TableCell>
                  <TableCell>{response.fullName}</TableCell>
                  <TableCell>
                    {new Date(response.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={response.marketingConsent ? "Yes" : "No"}
                      color={response.marketingConsent ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {response.aiAnalysis ? (
                      <Chip label="Generated" color="info" size="small" />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewResponse(response.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminResponsesPage; 