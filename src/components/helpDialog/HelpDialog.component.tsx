import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DropdownOption } from '../dropdown/Dropdown';
import { getSortedGroupedDataTypes, getDataType } from '../../utils/dataTypeUtils';
import styles from './HelpDialog.scss';
import { DataTypeFolder } from '../../_plugins';

const dialogStyles = (theme: any): any => ({
	root: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: 6,
		color: theme.palette.grey[500]
	}
});

// @ts-ignore-line
const DialogTitle = withStyles(dialogStyles)((props: any): React.ReactNode => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h5">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon fontSize="large" />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles(theme => ({
	root: {
		padding: theme.spacing(2)
	}
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
	root: {
		margin: 0,
		padding: theme.spacing(1)
	}
}))(MuiDialogActions);

// @ts-ignore-line
const Dialog = withStyles(() => ({
	root: {
		zIndex: '5000 !important',
		width: '100%'
	},
	paper: {
		maxWidth: 1000,
		width: '100%',
		height: '100%' // ensures the modal doesn't change size when the user filters the list of DTs
	}
}))(MuiDialog);

export type HelpDialogProps = {
	initialDataType: string;
	visible: boolean;
	onClose: any;
	coreI18n: any;
	dataTypeI18n: any;
	onSelectDataType: (dataType: DataTypeFolder) => void;
};

const DataTypeList = ({ onSelect, filterString }: any): any => {
	const dataTypes = getSortedGroupedDataTypes();
	const regex = new RegExp(filterString, 'i');

	const content: any = [];
	dataTypes.forEach(({ label, options }: { label: string; options: any }) => {
		let list: any = options;
		if (filterString.trim() !== '') {
			list = list.filter(({ value, label }: DropdownOption) => regex.test(value) || regex.test(label));
		}
		list = list.map(({ value, label }: DropdownOption) => (
			<li key={value} onClick={(): void => onSelect(value)}>{label}</li>
		));

		if (list.length) {
			content.push(
				<div key={label}>
					<h3>{label}</h3>
					<ul>{list}</ul>
				</div>
			);
		}
	});

	return content;
};

const HelpDialog = ({ initialDataType, visible, onClose, coreI18n, dataTypeI18n, onSelectDataType }: HelpDialogProps): JSX.Element => {
	const [dataType, setDataType] = React.useState();
	const [filterString, setFilterString] = React.useState('');

	const selectDataType = (dataType: DataTypeFolder) => {
		onSelectDataType(dataType);
		setDataType(dataType);
	};

	React.useEffect(() => {
		setDataType(initialDataType);
	}, [initialDataType]);

	const { name, Help } = getDataType(dataType);

	return (
		<Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={visible}>
			<DialogTitle onClose={onClose}>{name}</DialogTitle>
			<DialogContent dividers className={styles.contentPanel}>
				<div className={styles.dataTypeList}>
					<input
						type="text"
						placeholder="Filter Data Types"
						autoFocus
						onChange={(e): void => setFilterString(e.target.value)}
					/>
					<div className={styles.list}>
						<DataTypeList
							filterString={filterString}
							onSelect={selectDataType}
						/>
					</div>
				</div>
				<div className={styles.helpContent}>
					<Help
						coreI18n={coreI18n}
						i18n={dataTypeI18n[dataType]}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" variant="outlined">
					{coreI18n.close}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default HelpDialog;
