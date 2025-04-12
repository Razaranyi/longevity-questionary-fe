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
  CardContent
} from '@mui/material';
import { getAnalysis } from '../services/questionnaireService';

const ResultsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const { responseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!responseId) {
        setError('No response ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAnalysis(responseId);
        setAnalysis(data);
      } catch (err) {
        console.error('Error loading analysis:', err);
        setError('Failed to load analysis results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [responseId]);

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
          onClick={() => navigate('/questionnaire')}
        >
          Take Questionnaire
        </Button>
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          No Analysis Available
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/questionnaire')}
          sx={{ mt: 2 }}
        >
          Take Questionnaire
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Longevity Analysis
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Analysis Date: {new Date(analysis.createdAt).toLocaleDateString()}
      </Typography>

      <Card sx={{ mt: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {analysis.summary || 'Analysis summary not available.'}
          </Typography>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Key Insights
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {analysis.insights ? (
          <List>
            {analysis.insights.map((insight, index) => (
              <ListItem key={index} divider={index < analysis.insights.length - 1}>
                <ListItemText
                  primary={insight.title}
                  secondary={insight.description}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No specific insights available.
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {analysis.recommendations ? (
          <List>
            {analysis.recommendations.map((recommendation, index) => (
              <ListItem key={index} divider={index < analysis.recommendations.length - 1}>
                <ListItemText
                  primary={recommendation.title}
                  secondary={recommendation.description}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">
            No recommendations available.
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/questionnaire')}
        >
          Take Questionnaire Again
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsPage; 