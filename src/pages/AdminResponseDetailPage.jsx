import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminResponseDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [finalAnalysis, setFinalAnalysis] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { responseId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchResponse = async () => {
      if (!responseId) {
        setError('No response ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await axios.get(`/api/responses/${responseId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setResponse(result.data);
        setFinalAnalysis(result.data.finalAnalysis || '');
      } catch (err) {
        console.error('Error loading response:', err);
        setError('Failed to load response details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [responseId, authToken]);

  const handleGenerateAnalysis = async () => {
    try {
      setSubmitting(true);
      const result = await axios.post(`/api/responses/${responseId}/generate-analysis`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setResponse(result.data);
      setFinalAnalysis(result.data.finalAnalysis || result.data.aiAnalysis || '');
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAnalysis = async () => {
    try {
      setSubmitting(true);
      const result = await axios.put(`/api/responses/${responseId}/final-analysis`, finalAnalysis, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'text/plain'
        }
      });
      setResponse(result.data);
    } catch (err) {
      console.error('Error saving analysis:', err);
      setError('Failed to save analysis. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      <Box>
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/responses')}
        >
          Back to Responses
        </Button>
      </Box>
    );
  }

  if (!response) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          No Response Data Available
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/responses')}
          sx={{ mt: 2 }}
        >
          Back to Responses
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Response Details
      </Typography>

      <Card sx={{ mt: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Email:</strong> {response.userEmail}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {response.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Submitted:</strong> {new Date(response.submittedAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Marketing Consent:</strong> {' '}
                <Chip 
                  label={response.marketingConsent ? "Consented" : "No Consent"} 
                  color={response.marketingConsent ? "success" : "default"}
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Answers
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {response.answers && response.answers.length > 0 ? (
          <List>
            {response.answers.map((answer, index) => (
              <ListItem key={index} divider={index < response.answers.length - 1}>
                <ListItemText
                  primary={`Question ${index + 1}: ${answer.question?.questionText || 'Question text not available'}`}
                  secondary={`Score: ${answer.score}/5`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No answers recorded.
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          AI Analysis
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {response.aiAnalysis ? (
          <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {response.aiAnalysis}
          </Typography>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No AI analysis has been generated.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleGenerateAnalysis}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Generate Analysis'}
            </Button>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Final Analysis
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          value={finalAnalysis}
          onChange={(e) => setFinalAnalysis(e.target.value)}
          placeholder="Enter your analysis here..."
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          onClick={handleSaveAnalysis}
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Save Analysis'}
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/responses')}
        >
          Back to Responses
        </Button>
      </Box>
    </Box>
  );
};

export default AdminResponseDetailPage; 