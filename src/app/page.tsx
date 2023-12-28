"use client"

import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import { useState } from 'react';

import { MosaicWindow, Mosaic, MosaicZeroState, MosaicNode } from 'react-mosaic-component';
import { getLeaves, createBalancedTreeFromLeaves, DEFAULT_CONTROLS_WITH_CREATION } from 'react-mosaic-component';

import ChatUI from '@/components/chatui';

export default function Home() {
  const [currentNode, setCurrentNode] = useState<MosaicNode<number> | null>(1)

  const totalWindowCount = getLeaves(currentNode).length;

  // - auto arrange
  const autoArrange = () => {
    const leaves = getLeaves(currentNode);
    const balancedTree = createBalancedTreeFromLeaves(leaves) as MosaicNode<number> | null;
    setCurrentNode(balancedTree);
  };
  const onChange = (currentNode: MosaicNode<number> | null) => {
    setCurrentNode(currentNode);
  };


  return (
    <>
      <Navbar autoArrange={autoArrange} />
      <Mosaic<number>
        renderTile={(count, path) => (
          <Exmp
            count={count}
            path={path}
            totalWindowCount={totalWindowCount}
          />
        )}
        zeroStateView={<MosaicZeroState createNode={() => totalWindowCount + 1} />}
        value={currentNode}
        onChange={onChange}
        blueprintNamespace="bp5"
      />
    </>
  )
};

const Exmp = ({ count, path, totalWindowCount }: any) => {
  return (
    <MosaicWindow<number>
      title={`Lumen Chat`}
      createNode={() => totalWindowCount + 1}
      path={path}
      toolbarControls={DEFAULT_CONTROLS_WITH_CREATION}
    >
      <div className='px-10 py-4'>
        <ChatUI />
      </div>
    </MosaicWindow >
  )
}

const Navbar = ({ autoArrange }: any) => {
  return (
    <div className='overflow-y-hidden px-5 py-2 flex space-x-4 items-center'>
      <div className='title'>Lumen</div>
      <div className="controls">
        <button onClick={() => autoArrange()}>
          Auto Arrange
          <i className='bp5-button bp5-minimal bp5-icon-grid-view'></i>
        </button>
      </div>
    </div>
  )
}