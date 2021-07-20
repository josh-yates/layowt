import App from './App.svelte';
import { TreeNode } from './models/treeNode';

const app = new App({
	target: document.body,
	props: {
		model: new TreeNode()
	}
});

export default app;