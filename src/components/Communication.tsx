import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Badge,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Drawer,
  InputAdornment,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContactsIcon from '@mui/icons-material/Contacts';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Delete as DeleteIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transition: 'box-shadow 0.3s ease'
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transition: 'background-color 0.2s ease',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

interface Contact {
  id: string;
  name: string;
  role: string;
  online: boolean;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  lastMessage?: string;
}

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'Unread' | 'Read';
  type: 'Message' | 'Notification';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comm-tabpanel-${index}`}
      aria-labelledby={`comm-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Communication = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'System',
      recipient: 'All',
      subject: 'New Food Donation',
      content: 'A new food donation has been received from Care Foundation.',
      timestamp: '2024-03-17T10:30:00',
      status: 'Unread',
      type: 'Notification',
    },
    {
      id: '2',
      sender: 'Hope Center',
      recipient: 'Admin',
      subject: 'Urgent Request',
      content: 'We need additional meals for tomorrow\'s distribution.',
      timestamp: '2024-03-17T09:15:00',
      status: 'Read',
      type: 'Message',
    },
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Food Bank A', role: 'NGO Partner', online: true },
    { id: '2', name: 'Community Kitchen B', role: 'NGO Partner', online: false },
    { id: '3', name: 'John Doe', role: 'Delivery Driver', online: true },
    { id: '4', name: 'Jane Smith', role: 'Kitchen Staff', online: true },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { 
      id: '1', 
      name: 'Kitchen Team', 
      members: ['3', '4'],
      lastMessage: 'Meeting at 3 PM today'
    },
    { 
      id: '2', 
      name: 'NGO Partners', 
      members: ['1', '2'],
      lastMessage: 'Monthly donation schedule updated'
    },
  ]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewMessage = () => {
    setSelectedMessage(null);
    setOpenDialog(true);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'Read' } : msg
    ));
  };

  const handleSaveMessage = () => {
    const form = document.querySelector('form');
    const formElements = form?.elements as any;

    const newMessage: Message = {
      id: String(messages.length + 1),
      sender: 'Admin',
      recipient: formElements.recipient.value,
      subject: formElements.subject.value,
      content: formElements.content.value,
      timestamp: new Date().toISOString(),
      status: 'Unread',
      type: 'Message',
    };

    setMessages([...messages, newMessage]);
    setOpenDialog(false);
  };

  const unreadCount = messages.filter(msg => msg.status === 'Unread').length;
  const notificationCount = messages.filter(msg => msg.type === 'Notification').length;

  const filteredMessages = selectedChat
    ? messages.filter(m => m.recipient === selectedChat)
    : messages;

  const filterOptions = ['Online', 'Offline', 'Unread', 'Read'];
  const roleOptions = ['all', 'NGO Partner', 'Delivery Driver', 'Kitchen Staff'];

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || contact.role === roleFilter;
    const matchesFilters = selectedFilters.length === 0 || (
      (selectedFilters.includes('Online') && contact.online) ||
      (selectedFilters.includes('Offline') && !contact.online)
    );
    return matchesSearch && matchesRole && matchesFilters;
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Communication
        </Typography>
        <Box>
          <IconButton onClick={() => setContactsDrawerOpen(true)}>
            <ContactsIcon />
          </IconButton>
          <IconButton onClick={() => setOpenNewGroup(true)}>
            <GroupAddIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search messages and contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  input={<OutlinedInput label="Role" />}
                >
                  {roleOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Box>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              {filterOptions.map((filter) => (
                <MenuItem
                  key={filter}
                  onClick={() => handleFilterToggle(filter)}
                  sx={{
                    backgroundColor: selectedFilters.includes(filter)
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'transparent',
                  }}
                >
                  {filter}
                </MenuItem>
              ))}
            </Menu>

            {selectedFilters.length > 0 && (
              <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedFilters.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    onDelete={() => handleFilterToggle(filter)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', height: 'calc(100% - 48px)' }}>
              {/* Sidebar */}
              <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider' }}>
                <List>
                  {selectedTab === 0 ? (
                    filteredContacts.map((contact) => (
                      <StyledListItem 
                        key={contact.id}
                        button
                        selected={selectedChat === contact.id}
                        onClick={() => setSelectedChat(contact.id)}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color={contact.online ? "success" : "error"}
                          >
                            <Avatar>{contact.name[0]}</Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={contact.name}
                          secondary={contact.role}
                        />
                      </StyledListItem>
                    ))
                  ) : (
                    groups.map((group) => (
                      <StyledListItem
                        key={group.id}
                        button
                        selected={selectedChat === group.id}
                        onClick={() => setSelectedChat(group.id)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <GroupIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={group.name}
                          secondary={group.lastMessage}
                        />
                      </StyledListItem>
                    ))
                  )}
                </List>
              </Box>

              {/* Chat Area */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {filteredMessages.map((message) => (
                    <React.Fragment key={message.id}>
                      <StyledListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: message.sender === 'Hotel Staff' ? 'primary.main' : 'secondary.main' }}>
                            {message.sender[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.sender}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                {message.content}
                              </Typography>
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {message.timestamp}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </StyledListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleNewMessage()}
                  />
                  <StyledButton
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleNewMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </StyledButton>
                </Box>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Create Group Dialog */}
      <Dialog 
        open={openNewGroup} 
        onClose={() => setOpenNewGroup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Select Members</InputLabel>
            <Select
              multiple
              value={selectedMembers}
              onChange={(e) => setSelectedMembers(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Select Members" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value}
                      label={contacts.find(c => c.id === value)?.name}
                      onDelete={() => setSelectedMembers(selectedMembers.filter(id => id !== value))}
                    />
                  ))}
                </Box>
              )}
            >
              {contacts.map((contact) => (
                <MenuItem key={contact.id} value={contact.id}>
                  {contact.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewGroup(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              // Handle group creation
            }}
            disabled={!newGroupName || selectedMembers.length === 0}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contacts Drawer */}
      <Drawer
        anchor="right"
        open={contactsDrawerOpen}
        onClose={() => setContactsDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contacts
          </Typography>
          <TextField
            fullWidth
            placeholder="Search contacts..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredContacts.map((contact) => (
              <ListItem
                key={contact.id}
                secondaryAction={
                  <IconButton edge="end">
                    <MessageIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={contact.online ? "success" : "error"}
                  >
                    <Avatar>{contact.name[0]}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  secondary={contact.role}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="Messages" />
          <Tab label="Notifications" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  bgcolor: message.status === 'Unread' ? 'action.hover' : 'transparent',
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {message.status === 'Unread' && (
                      <Button
                        size="small"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteMessage(message.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    {message.type === 'Notification' ? <NotificationsIcon /> : <MessageIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{message.subject}</Typography>
                      <Chip
                        label={message.type}
                        size="small"
                        color={message.type === 'Notification' ? 'info' : 'default'}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        From: {message.sender} | To: {message.recipient}
                      </Typography>
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            {messages.filter(msg => msg.type === 'Message').map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  bgcolor: message.status === 'Unread' ? 'action.hover' : 'transparent',
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {message.status === 'Unread' && (
                      <Button
                        size="small"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteMessage(message.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <MessageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={message.subject}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        From: {message.sender} | To: {message.recipient}
                      </Typography>
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {messages.filter(msg => msg.type === 'Notification').map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  bgcolor: message.status === 'Unread' ? 'action.hover' : 'transparent',
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {message.status === 'Unread' && (
                      <Button
                        size="small"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteMessage(message.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={message.subject}
                  secondary={
                    <>
                      <Typography variant="body2">{message.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>New Message</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="recipient"
              label="Recipient"
              select
              defaultValue="All"
              fullWidth
              required
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Kitchen Staff">Kitchen Staff</MenuItem>
              <MenuItem value="Delivery Staff">Delivery Staff</MenuItem>
            </TextField>
            <TextField
              name="subject"
              label="Subject"
              fullWidth
              required
            />
            <TextField
              name="content"
              label="Message"
              multiline
              rows={4}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveMessage}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Communication; 