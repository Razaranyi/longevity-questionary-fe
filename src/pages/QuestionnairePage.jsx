import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  TextField
} from '@mui/material';
import { getActiveQuestions, submitResponses } from '../services/questionnaireService';

const QuestionnairePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getActiveQuestions();
        setQuestions(data);
        // Initialize response object
        const initialResponses = {};
        data.forEach(q => {
          initialResponses[q.id] = '';
        });
        setResponses(initialResponses);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questionnaire. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle responses
  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Navigate through steps
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Submit questionnaire
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Format responses for submission
      const formattedResponses = Object.keys(responses).map(questionId => ({
        questionId: questionId,
        responseText: responses[questionId]
      }));
      
      const result = await submitResponses({
        responses: formattedResponses
      });
      
      // Navigate to results page with the response ID
      navigate(`/results/${result.id}`);
    } catch (err) {
      console.error('Error submitting responses:', err);
      setError('Failed to submit questionnaire. Please try again.');
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Get current question
  const currentQuestion = questions[activeStep];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Longevity Questionnaire
      </Typography>
      
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {questions.map((question, index) => (
          <Step key={question.id}>
            <StepLabel>Question {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {currentQuestion && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentQuestion.questionText}
          </Typography>
          
          {currentQuestion.questionType === 'MULTIPLE_CHOICE' ? (
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Select one option:</FormLabel>
              <RadioGroup
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              >
                {currentQuestion.options?.map((option, index) => (
                  <FormControlLabel 
                    key={index} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter your answer here..."
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || submitting}
        >
          Back
        </Button>
        
        {activeStep === questions.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!responses[currentQuestion?.id] || submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!responses[currentQuestion?.id]}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default QuestionnairePage; 