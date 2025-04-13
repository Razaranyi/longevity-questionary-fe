import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  CircularProgress, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getAllQuestions, createQuestion, updateQuestion, toggleQuestionStatus, deleteQuestion } from '../services/questionService';

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    orderNumber: 0,
    active: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all questions (including inactive)
  useEffect(() => {
    fetchQuestions();
  }, []);
  
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions();
      // Sort by order number
      data.sort((a, b) => a.orderNumber - b.orderNumber);
      setQuestions(data);
      setError('');
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle opening dialog for new question
  const handleAddNew = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      orderNumber: questions.length > 0 ? questions[questions.length - 1].orderNumber + 1 : 1,
      active: true
    });
    setOpenDialog(true);
  };
  
  // Handle opening dialog for editing
  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      orderNumber: question.orderNumber,
      active: question.active
    });
    setOpenDialog(true);
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };
  
  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (editingQuestion) {
        // Update existing question
        await updateQuestion(editingQuestion.id, {
          ...formData,
          orderNumber: parseInt(formData.orderNumber)
        });
        setSnackbar({
          open: true,
          message: 'Question updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new question
        await createQuestion({
          ...formData,
          orderNumber: parseInt(formData.orderNumber)
        });
        setSnackbar({
          open: true,
          message: 'Question created successfully!',
          severity: 'success'
        });
      }
      
      // Refresh questions list
      await fetchQuestions();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving question:', err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || 'Failed to save question'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle toggling question active status
  const handleToggleStatus = async (questionId) => {
    try {
      await toggleQuestionStatus(questionId);
      await fetchQuestions();
      setSnackbar({
        open: true,
        message: 'Question status updated!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error toggling question status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update question status',
        severity: 'error'
      });
    }
  };
  
  // Handle deleting a question
  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await deleteQuestion(questionId);
        await fetchQuestions();
        setSnackbar({
          open: true,
          message: 'Question deleted successfully!',
          severity: 'success'
        });
      } catch (err) {
        console.error('Error deleting question:', err);
        setSnackbar({
          open: true,
          message: 'Failed to delete question',
          severity: 'error'
        });
      }
    }
  };
  
  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && questions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Questionnaire Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Question
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" width="10%">Order</TableCell>
              <TableCell>Question Text</TableCell>
              <TableCell align="center" width="10%">Status</TableCell>
              <TableCell align="center" width="20%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow 
                key={question.id}
                sx={{ backgroundColor: question.active ? 'inherit' : '#f5f5f5' }}
              >
                <TableCell align="center">{question.orderNumber}</TableCell>
                <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {question.questionText}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={question.active ? 'Active' : 'Inactive'}>
                    <IconButton 
                      onClick={() => handleToggleStatus(question.id)}
                      color={question.active ? 'success' : 'default'}
                    >
                      {question.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(question)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(question.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Question Edit/Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Question Text"
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Order Number"
              name="orderNumber"
              type="number"
              value={formData.orderNumber}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminQuestionsPage; 