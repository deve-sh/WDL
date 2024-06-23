import { ReactElement, useEffect, useRef } from "react";

import { Menu, MenuList, MenuItem } from "@chakra-ui/react";

type Props = {
	nodeId: string;
	x: number;
	y: number;

	actions: {
		id: string;
		icon: ReactElement;
		text: string;
		onClick: () => unknown;
	}[];

	close: () => void;
};

const ContextMenu = (props: Props) => {
	const menuListRef = useRef<HTMLDivElement>(null);

	const { actions, x, y, close } = props;

	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (!menuListRef.current) return;

			const target = event.target as Node;

			if (menuListRef.current.contains(target)) return;

			close();
		};
		window.addEventListener("click", onClick);
		return () => window.removeEventListener("click", onClick);
	}, [close]);

	return (
		<Menu onClose={close} isOpen>
			<div
				ref={menuListRef}
				style={{ position: "fixed", zIndex: "1000", left: x, top: y }}
			>
				<MenuList>
					{actions.map((action) => (
						<MenuItem
							icon={action.icon}
							onClick={action.onClick}
							key={action.id}
						>
							{action.text}
						</MenuItem>
					))}
				</MenuList>
			</div>
		</Menu>
	);
};

export default ContextMenu;
