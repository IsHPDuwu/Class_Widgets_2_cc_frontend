import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  Text,
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Input,
  Label,
} from '@fluentui/react-components';
import { EditRegular, DeleteRegular, AddRegular } from '@fluentui/react-icons';
import type { Subject } from '../../api/scheduleTypes';

interface SubjectsEditorProps {
  subjects: Subject[];
  onChange: (subjects: Subject[]) => void;
}

export const SubjectsEditor: React.FC<SubjectsEditorProps> = ({ subjects, onChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleSave = () => {
    if (editingSubject) {
      if (subjects.find(s => s.id === editingSubject.id)) {
        onChange(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
      } else {
        onChange([...subjects, editingSubject]);
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onChange(subjects.filter(s => s.id !== id));
  };

  const openDialog = (subject?: Subject) => {
    setEditingSubject(subject || {
      id: crypto.randomUUID(),
      name: '',
      color: '#13b4d6',
      isLocalClassroom: true
    });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<AddRegular />} onClick={() => openDialog()}>Add Subject</Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {subjects.map(subject => (
          <Card key={subject.id} style={{ width: 250, borderTop: `4px solid ${subject.color || '#ccc'}` }}>
            <CardHeader
              header={<Text weight="semibold">{subject.name}</Text>}
              description={<Text size={200}>{subject.teacher || 'No Teacher'} | {subject.location || 'Local'}</Text>}
              action={
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button icon={<EditRegular />} appearance="transparent" onClick={() => openDialog(subject)} />
                  <Button icon={<DeleteRegular />} appearance="transparent" onClick={() => handleDelete(subject.id)} />
                </div>
              }
            />
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(_e, data) => setIsDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editingSubject?.name ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Label htmlFor="subName">Name</Label>
              <Input id="subName" value={editingSubject?.name || ''} onChange={e => setEditingSubject(prev => ({ ...prev!, name: e.target.value }))} />

              <Label htmlFor="subTeacher">Teacher</Label>
              <Input id="subTeacher" value={editingSubject?.teacher || ''} onChange={e => setEditingSubject(prev => ({ ...prev!, teacher: e.target.value }))} />

              <Label htmlFor="subColor">Color</Label>
              <input id="subColor" type="color" value={editingSubject?.color || '#000000'} onChange={e => setEditingSubject(prev => ({ ...prev!, color: e.target.value }))} style={{ width: '100%', height: '32px' }} />
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button appearance="primary" onClick={handleSave}>Save</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
