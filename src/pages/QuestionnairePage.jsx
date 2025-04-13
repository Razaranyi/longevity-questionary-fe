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
  TextField,
  Checkbox
} from '@mui/material';
import { getActiveQuestions, submitResponses, checkEmailSubmission } from '../services/questionnaireService';
import { useAuth } from '../context/AuthContext';

const QuestionnairePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [marketingConsent, setMarketingConsent] = useState(user?.marketingConsent !== false);
  const [emailStep, setEmailStep] = useState(!user?.isClient); // Skip email step if client is logged in
  const [emailError, setEmailError] = useState('');
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

    // Only fetch questions after email identification
    if (!emailStep) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [emailStep]);
  
  // Pre-fill form fields if client user is logged in
  useEffect(() => {
    if (user?.isClient) {
      setEmail(user.email || '');
      setFullName(user.fullName || '');
      setMarketingConsent(user.marketingConsent !== false);
      setEmailStep(false); // Skip email step for client users
    }
  }, [user]);

  // Validate email format
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle email identification step
  const handleEmailSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!fullName.trim()) {
      setEmailError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      // Check if this email has already submitted responses
      const checkResult = await checkEmailSubmission(email);
      if (checkResult.hasSubmitted) {
        setEmailError(`This email has already submitted ${checkResult.count} response(s). Please use a different email.`);
        setLoading(false);
        return;
      }

      // Email is valid and hasn't submitted before
      setEmailStep(false);
      setEmailError('');
    } catch (err) {
      console.error('Error checking email:', err);
      // If the check fails, still allow proceeding to the questionnaire
      setEmailStep(false);
    }
  };

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
      const formattedAnswers = Object.keys(responses).map(questionId => ({
        questionId: parseInt(questionId),
        score: parseInt(responses[questionId])
      }));
      
      const submission = {
        userEmail: email,
        fullName: fullName,
        marketingConsent: marketingConsent,
        answers: formattedAnswers
      };
      
      const result = await submitResponses(submission);
      
      // Navigate to a thank you page or results page
      navigate(`/thank-you`);
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

  // Email identification step
  if (emailStep) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Longevity Questionnaire
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Please identify yourself to begin the questionnaire
          </Typography>
          
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!emailError && !fullName.trim()}
            margin="normal"
            required
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                color="primary"
              />
            }
            label="I agree to receive commercial and marketing materials"
            sx={{ mt: 1, display: 'block' }}
          />
          
          {emailError && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {emailError}
            </Alert>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmailSubmit}
            sx={{ mt: 2 }}
            fullWidth
          >
            Start Questionnaire
          </Button>
        </Paper>
      </Box>
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
          
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Rate from 1 (lowest) to 5 (highest):</FormLabel>
            <RadioGroup
              row
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((score) => (
                <FormControlLabel 
                  key={score} 
                  value={score.toString()} 
                  control={<Radio />} 
                  label={score.toString()} 
                />
              ))}
            </RadioGroup>
          </FormControl>
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